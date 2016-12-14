var express = require('express');
var router = express.Router({mergeParams: true});

var permission = require('../middlewares/requires_permission');
var jsonParser = require('body-parser').json();

var questionModel = require('../models/questions');

// List of Questions for the exam
router.get('/', permission(1), function(req, res) {
    var exam_id = req.params.exam_id;

    questionModel.getAllQuestions(exam_id, {visable: false})
        .then(function(result) {
            res.send(result);
        });
});

// Create a new question
router.post('/', permission(2), jsonParser, function(req, res) {

    var exam_id = req.params.exam_id;

    var number = req.body.number;
    var body_text = req.body.body_text;
    if (req.user) {
        var author = req.user;
    } else if (req.permission_level === 3) {
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

module.exports = router;
