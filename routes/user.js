var express = require('express');
var uuid = require('uuid');

var router = express.Router({mergeParams: true});

var permission = require('../middlewares/requires_permission');
var jsonParser = require('body-parser').json();

var userModel = require('../models/users');

// List all users
router.get('/', permission(2), function(req, res) {
    var exam_id = req.params.exam_id;
    userModel.getAllUsers(exam_id)
        .then(function(users) {
            res.json(users);
        });
});

// Create a user, Guest so strangers can join ;)
router.post('/', permission(0), jsonParser, function(req, res) {
    var new_secret = uuid.v4();
    console.log(new_secret);
    var exam_id = req.exam_id;
    var name_noun = req.body.name_noun;
    var name_color = req.body.name_color;

    userModel.createUser(exam_id, name_noun, name_color, new_secret, 1)
        .then(function(new_user) {
            res.json({
                "id": new_user.id,
                "token": new_secret
            });
        })
        .catch(function(error) {
            console.error(error);
            res.status(500).send();
        });
});

module.exports = router;
