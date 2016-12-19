/**
 * Created by liam on 19/12/16.
 */

var express = require('express');
var router = express.Router({mergeParams: true});

var jsonParser = require('body-parser').json();

var answerModel = require('../models/answers');
var commentModel = require('../models/comments');

router.get('/', function(req, res) {
    answerModel.getAnswers(req.exam_id, req.params.question_id)
        .then(function(answers) {
            res.json(answers);
        })
        .catch(function(error) {
            res.status(500).json({error: "Error retrieving answers"});
        });
});

router.post('/', jsonParser, function(req, res) {

    var exam_id = req.exam_id;

    var parent_question = req.params.question_id;
    var author;

    if (req.user) {
        author = req.user;
    } else if (req.permission_level === 4 && req.body.author) {
        author = req.body.author;
    } else  {
        res.status(400).json({error: "Missing user field"});
    }
    var body_text = req.body.body_text;

    if (!body_text) {
        res.status(400).json({error: "Missing body_text"});
    }

    answerModel.createAnswer(exam_id, parent_question, author, body_text)
        .then(function(new_answer) {
            res.status(201).json({id: new_answer.id});
        });
});

router.get('/:answer_id', function(req, res) {

    var exam_id = req.exam_id;
    var answer_id = req.params['answer_id'];

    var queries = [
        answerModel.getAnswer(exam_id, answer_id),
        commentModel.getAnswerComments(exam_id, answer_id)
            ];

    Promise.all(queries)
       .then(function(result) {
           var answer = result[0];
           var comments = result[1];

           answer.comments = comments;
           res.json(answer);
       });
});

router.delete('/:answer_id', function(req, res) {
    var exam_id = req.exam_id;
    var answer_id = req.params['answer_id'];

    answerModel.deleteAnswer(exam_id, answer_id)
        .then(function(success) {
            res.status(200).send();
        });
});

router.post('/:answer_id/upvote', function(req, res) {
    var exam_id = req.exam_id;
    var answer_id = req.params['answer_id'];
    var user;

    if (req.user) {
        user = req.user;
    } else {
        res.status(400).json({error: "No user specified"});
    }
    answerModel.upvoteAnswer(exam_id, user, answer_id)
        .then(function(result) {

        })
});

var commentsRouter = require('./comments');
router.use('/:answer_id/comments', commentsRouter);

module.exports = router;
