var express = require('express');
var crypto = require('crypto');

var users = require('../models/users');

// Authentication
function loadUser (req, res, next) {
    if (req.query.token) {
        console.log("User connected with exam_id: " + req.params.exam_id);
        users.getUserByToken(req.exam_id, req.query.token)
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
    } else {
        req.permission_level = 0;
        next();
    }
}

module.exports = loadUser;
