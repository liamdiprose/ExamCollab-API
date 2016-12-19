/**
 * Created by liam on 12/12/16.
 */

module.exports = function(req, res, next) {

    console.log("[" + req.method + "] " + req.originalUrl);
    next();
};