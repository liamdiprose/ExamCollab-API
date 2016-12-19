/**
 * Created by liam on 10/12/16.
 */


var express = require('express');

app = express();

var userModel = require('../models/users');

/**
 *
 */
app.param('exam_id', function (req, res, next, exam_id) {
    console.log("Parameter function for exam_id");
    req.exam_id = exam_id;
    // Load in user if token supplied in query string
    console.log("Exam ID: " + exam_id + " User token: " + req.query.token);

    // If user is not already loaded (index.e. from global users)
    if (! req.user) {
        // Load in default user config

        req.user = null;
        req.permission_level = 1;


        //  token supplied
        auth_token = req.query.token;

        if (auth_token) {
            userModel.getUserByToken(auth_token)
                .then(function(result) {
                    req.user = result.id;
                    req.permission_level = result.permission_level;
                });
        } else {

        }



    }

    next();
});

module.exports = app;
