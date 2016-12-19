var express = require('express');
var router = express.Router({mergeParams: true});

var permission = require('../middlewares/requires_permission');
var jsonParser = require('body-parser').json();

var questionModel = require('../models/questions');
var answerModel = require('../models/answers');
var commentModel = require('../models/comments');

// List of Questions for the exam
router.get('/', permission(1), function(req, res) {
    var exam_id = req.params.exam_id;

    questionModel.getAllQuestions(exam_id, {visible: false})
        .then(function(result) {
            res.send(result);
        });
});

// Create a new question
router.post('/', permission(2), jsonParser, function(req, res) {

    var exam_id = req.exam_id;

    var number = req.body.number;
    var body_text = req.body.body_text;
    if (req.user) {
        var author = req.user;
    } else if (req.permission_level === 4) {
        var author = req.body.author;
    } else {
        res.status(400).json({error: "No user specified."});
    }

    var parent_question = req.body.parent_question;

    questionModel.createQuestion(exam_id, number, body_text, author, parent_question)
        .then(function(success) {
            res.status(201).send();
        })
        .catch(function(error) {
            res.status(500).send();
            console.error(error);
        });
});

router.get('/:question_id', function(req, res) {
    var question_id = req.params.question_id;

    var querys = [
        questionModel.getQuestion(req.exam_id, question_id),
        answerModel.getAnswers(req.exam_id, question_id),
        commentModel.getQuestionComments(req.exam_id, question_id),
        commentModel.getAllQuestionAnswerComments(req.exam_id, question_id)
    ];

    Promise.all(querys)
        .then(function(results) {

            var question = results[0];
            var answers = results[1];
            var q_comments = results[2];
            var a_comments = results[3];

            if(question) {
                // Add trivial results to question response
                question.comments = q_comments;

                // Add a comments array to each answer
                question.answers = [];
                for (index = 0; index < answers.length; index++) {
                    answers[index].comments = [];
                    question.answers.push(answers[index])
                }

                // Construct answer lookup
                var answer_lookup = {};
                for (var i = 0; i < answers.length; i++) {
                    answer_lookup[answers[i].id] = answers[i];
                }

                // Load answer_comments into corresponding answer's comments array
                for (var i = 0; i < a_comments.length; i++) {
                    answer_lookup[a_comments[i].parent_answer].comments.push(a_comments[i]);
                }

                res.json(question);
            } else {
                res.status(404).json({error: "No question found"});
            }
        });
});

var answerRouter = require('./answers');
router.use('/:question_id/answers', answerRouter);

var commentRouter = require('./comments');
router.use('/:question_id/comments', commentRouter);

module.exports = router;
