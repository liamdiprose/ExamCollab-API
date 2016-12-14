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


// Authenticate users if they access an exam with a token
router.param('exam_id', function (req, res, next, exam_id) {
    console.log("Parameter function for exam_id");
    req.exam_id = exam_id;
    // Load in user if token supplied in query string
    console.log("Exam ID: " + exam_id + " User token: " + req.query.token);

    userModel.getUserByToken(req.exam_id, req.query.token)
        .then(function (result) {
            if (result) {
                req.user = result.user;
                req.permission_level = result.permission_level;
            } else {
                req.permission_level = 0;
            }
            next();
        })
        .catch(function(error) {
            console.error("Error happened during SQL query.\n", error)
            next(new Error("SQL lookup Fail"));
        });
    next();
});

router.get('/', permission(3), function(req, res) {
    examModel.getAllExams()
        .then(function(result) {
            res.json(result)
        })
});

// Create a new exam
router.post('/', permission(0), jsonParser, function (req, res) {
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



router.get('/:exam_id', permission(1), function(req, res) {

    // TODO: Do the batch function thing

    var exam_id = req.exam_id;

    var queries = [
        examModel.getExam(exam_id),
        questionModel.getAllQuestions(exam_id, {visable: true}),
        answerModel.getAllAnswers(exam_id, {visable: true}),
        commentModel.getAllComments(exam_id)
    ];

    Promise.all(queries)
        .then(function(results){
            var metadata = results[0];  // examModel.getAllExams()
            var questions = results[1];

            // Construct lookup table for questions indexed by id
            var question_lookup = {};
            for (question in questions) {
                question_lookup[question.id] = question;
            }
            // Add empty containers for answers and comments
            for (question in questions) {
                question.answers = [];
                question.comments = [];
            }

            var answers = results[2];
            // Add answers to respective questions
            for (answer in answers) {
                question_lookup[answer.parent_question].answers.add(answer);
            }

            // Construct answer lookup (for comments)
            answer_lookup = {};
            for (answer in answers) {
                answer_lookup[answer.id] = answer;
            }

            var comments = results[3];
            for (comment in comments) {
                if (comment.parent_question) {
                    question_lookup[comment.parent_question].comments.add(comment);
                } else {
                    answer_lookup[comment.parent_answer].comments.add(comment);
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

router.delete('/:exam_id', permission(2), function (req, res) {
    examModel.deleteExam(req.params.id)
        .then(function (result) {
            res.status(204).send();
        });
});

var questionRoutes = require('./question');
router.use('/:exam_id/questions', questionRoutes);
router.use('/:exam_id/users', require('./user'));

module.exports = router;
