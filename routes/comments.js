/**
 * Created by liam on 19/12/16.
 */


var express = require('express');
var router = express.Router({mergeParams: true});

var jsonParser = require('body-parser').json();

var commentModel = require('../models/comments');

// Finds if comments parent is a question or an answer
function parentIsQuestion(req) {
    return !('answer_id' in req.params);
}

// Get all comments
router.get('/', function(req, res) {

    var exam_id = req.exam_id;
    var task;

    if (parentIsQuestion(req)) {
        var question_id = req.params.question_id;
        task = commentModel.getQuestionComments(exam_id, question_id);
    } else {
        var answer_id = req.params.answer_id;
        task = commentModel.getAnswerComments(exam_id, answer_id);
    }
    task.then(function(comments) {
        res.json(comments);
    });

});

router.post('/', jsonParser, function(req, res) {
    var exam_id = req.exam_id;
    var comment_text = req.body['text'];

    var author;

    if (req.user) {
        author = req.user;
    } else if ((req.permission_level == 4) && ('author' in req.body)) {
        author = req.body['author'];
    } else {
        res.status(400).json({error: "Missing author"});
    }

    var task;
    if (parentIsQuestion(req)) {
        var question_id = req.params['question_id'];
        task = commentModel.insertQuestionComment(exam_id, question_id, comment_text, author)
    } else {
        var answer_id = req.params['answer_id'];
        task = commentModel.insertAnswerComment(exam_id, answer_id, comment_text, author)

    }
    task.then(function(new_comment) {
        res.status(201).json({id: new_comment.id});
    });
});

router.get('/:comment_id', function(req, res) {
    var exam_id = req.exam_id;
    var comment_id = req.params['comment_id'];
    commentModel.getComment(exam_id, comment_id)
        .then(function(comment) {
            res.json(comment);
        });
});

module.exports = router;
