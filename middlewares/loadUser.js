var express = require('express');
var crypto = require('crypto');

var users = require('../models/users');

// Authentication
function loadUser (req, res, next) {
    req.authenticated = false;
    if (req.query.token) {
        users.getUserByToken(false, req.query.token)
            .then(function (result) {
                if (result) {
                    req.authenticated = true;
                    req.permission_level = result.permission_level;
                    console.log("Admin access Granted to connection " + req.ip);
                } else {

                    req.permission_level = 0;
                }
                next();
            })
            .catch(function(error) {
                console.error("Error happened during SQL query.\n", error);
                next(new Error("SQL lookup Fail"));
            });
    } else {
        req.permission_level = 0;
        next();
    }
}

module.exports = loadUser;
