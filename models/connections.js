/**
 * Created by liam on 9/12/16.
 */
var database = require('../models/database');
var db = database.db;
var sql = database.sql;

// Logs connection then returns connections from ip in last 3 seconds
exports.logConnection = function(ip) {
    var log_connection_returning_count = sql('./sql/createConnectionLog.sql');
    return db.one(log_connection_returning_count, {ip: ip});
};
