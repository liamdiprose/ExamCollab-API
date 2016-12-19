/**
 * Created by liam on 25/11/16.
 */

var express = require('express');
var router = express.Router({mergeParams: true});

// Database models
var loadUser = require('../middlewares/loadUser');

// Load in admin access
router.use(loadUser);
// router.all('*', connection_limiting);



// Load in subroutes
router.use('/exams', require('./exam'));



module.exports = router;
