/**
 * Created by liam on 25/11/16.
 */

var express = require('express');
var router = express.Router({mergeParams: true});

// Database models


// router.all('*', loadUser);
// router.all('*', connection_limiting);



// Load in subroutes
router.use('/exams', require('./exam'));



module.exports = router;
