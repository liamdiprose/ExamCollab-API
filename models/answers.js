/**
 * Created by liam on 23/11/16.
 */

var database = require('./database');
var db = database.db;
var sql = database.sql;

// Get answers for a particular question
exports.getAnswers = function (exam_id, question_id) {
  return db.any("SELECT * FROM ${exam_id^}.answers WHERE parent_question=${question_id}", {exam_id: 'exam_' + exam_id, question_id: question_id});
};

exports.getAllAnswers = function (exam_id, options = {}) {

    if (options.visable) {
        return db.any("SELECT * FROM ${exam_id^}.answers WHERE superceded_by = NULL", {exam_id: 'exam_' + exam_id});
    } else {
        return db.any("SELECT * FROM ${exam_id^}.answers", {exam_id: 'exam_' + exam_id});
    }
};
