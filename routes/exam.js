var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var router = express.Router({mergeParams: true});
var permission = require('../middlewares/requires_permission');

var userModel = require('../models/users');
var examModel = require('../models/exams');
var answerModel = require('../models/answers');
var commentModel = require('../models/comments');
var questionModel = require('../models/questions');

var roles = userModel.roles;

// Authenticate users if they access an exam with a token
router.param('exam_id', function (req, res, next, exam_id) {
    examModel.checkExists(exam_id)
        .then(function(result) {
            if (result.exists) {
                req.exam_id = exam_id;
                // Load in user if token supplied in query string
                if (!req.authenticated) {
                    console.log("Exam ID: " + exam_id + " User token: " + req.query.token);
                    userModel.getUserByToken(req.exam_id, req.query.token)
                        .then(function (result) {
                            if (result) {
                                req.user = result.user;
                                req.permission_level = result.permission_level;
                                req.authenticated = true;
                            } else {
                                req.permission_level = 0;
                            }
                            next();
                        })
                        .catch(function (error) {
                            console.error("Error happened during SQL query.\n", error)
                            next(new Error("SQL lookup Fail"));
                        });
                } else {
                    next();
                }
            } else {
                res.status(404).json({error: "Exam doesn't exist"});
            }
        });
});

router.get('/', permission(roles.admin), function(req, res) {
    examModel.getAllExams()
        .then(function(result) {
            res.json(result)
        })
});

// Create a new exam
router.post('/', permission(roles.guest), jsonParser, function (req, res) {
    if (req.body) {
        console.log(req.body);
        if ('short_name' in req.body) {
            examModel.createExam(req.body.short_name, null, null, null, null)
                .then(function(exam_id) {
                    res.json({exam_id: exam_id.id});
                });
        } else {
            res.status(400).send("\"short_name\" value required in request.");
        }
    } else {
        res.status(400).json({"error_message": "JSON data required."});
    }
});



router.get('/:exam_id', permission(roles.member), function(req, res) {

    // TODO: Do the batch function thing

    var exam_id = req.exam_id;
    console.log("Getting answers from exam_" + exam_id);

    var queries = [
        examModel.getExam(exam_id),
        questionModel.getAllQuestions(exam_id, {visible: true}),
        answerModel.getAllAnswers(exam_id, {visible: true}),
        commentModel.getAllComments(exam_id)
    ];

    Promise.all(queries)
        .then(function(results){
            var metadata = results[0];  // examModel.getAllExams()
            var questions = results[1];

            // Construct lookup table for questions indexed by id
            var question_lookup = {};
            console.log("All Questions: " + JSON.stringify(questions));
            for (var i = 0; i < questions.length; i++) {
                question_lookup[questions[i].id] = questions[i];
            }
            // Add empty containers for answers and comments
            for (var index = 0; index < questions.length; index++) {
                questions[index].answers = [];
                questions[index].comments = [];
            }

            var answers = results[2];
            console.log("Answers: " + JSON.stringify(answers));
            // Add answers to respective questions
            for (var i = 0; i < answers.length; i++) {
                console.log("Pushing answer: " + JSON.stringify(answers[i]));
                question_lookup[answers[i].parent_question].answers.push(answers[i]);
            }

            // Construct answer lookup (for comments)
            answer_lookup = {};

            for (var i = 0; i < answers.length; i++) {
                answer_lookup[answers[i].id] = answers[i];
                answers[i].comments = [];
            }

            var comments = results[3];
            console.log("Comments: " + JSON.stringify(comments));
            for (var i = 0; i < comments.length; i++) {
                if (comments[i].parent_question === null) {
                    answer_lookup[comments[i].parent_answer].comments.push(comments[i]);

                } else {
                    question_lookup[comments[i].parent_question].comments.push(comments[i]);
                }
            }

            res.send({
                metadata: metadata,
                questions: questions
            });

        })
        .catch(function(reason) {
            console.error(reason);
            res.status(500).send();
        });
});

router.delete('/:exam_id', permission(roles.owner), function (req, res) {
    examModel.deleteExam(req.params.id)
        .then(function (result) {
            res.status(204).send();
        });
});

var questionRoutes = require('./question');
router.use('/:exam_id/questions', questionRoutes);
router.use('/:exam_id/users', require('./user'));

module.exports = router;
