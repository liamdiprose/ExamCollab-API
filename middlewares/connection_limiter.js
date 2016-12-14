/**
 * Created by liam on 9/12/16.
 */

var connection_model = require('../models/connections');

// Log connection and check number connections in last 3 seconds
function connection_limiting(res, req, next) {
    connection_model.logConnection(res.ip.toString())
        .then(function(result) {
            // If 3 or more connections in 3 seconds, reject
            if (result.numberofconnections > 2) {
                next(new Error("Too many connections in 3 seconds."));
            } else {
                next();
            }
        })
}

module.exports = connection_limiting;
