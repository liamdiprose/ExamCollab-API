/**
 * Created by liam on 10/12/16.
 */


var express = require('express');

app = express();

app.param('exam_id', function (req, res, next, exam_id) {
    console.log("Parameter function for exam_id");
    req.exam_id = exam_id;
    // Load in user if token supplied in query string
    console.log("Exam ID: " + exam_id + " User token: " + req.query.token);
    next();
});

module.exports = app;
