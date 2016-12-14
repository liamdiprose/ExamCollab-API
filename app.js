/**
 * Created by liam on 23/11/16.
 */


var express = require('express');
var routes = require('./routes');

var app = express();
// Options
app.disable('x-powered-by');

// Middleware
var loadUser = require('./middlewares/loadUser');
var logging = require('./middlewares/logger');
//var loadExam = require('./middlewares/examParameter');
//var connection_limiting = require('./middlewares/connection_limiter');

// app.param('exam_id', function (req, res, next, value) {
//     console.log("Parameter function for exam_id");
//     req.exam_id = value;
//     next();
// });


//app.use(loadExam);



//app.use(connection_limiting);

// Routing
app.use(routes);
app.use(logging);


module.exports = app;