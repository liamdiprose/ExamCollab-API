/**
 * Created by liam on 23/11/16.
 */


var database = require('./database');
var db = database.db;
var sql = database.sql;

exports.getAllQuestions = function(exam_id, options = {}) {
    if (options.latest) {
        return db.any("SELECT * FROM ${examid^}.questions WHERE supercedded_by IS NULL", {examid: 'exam_' + exam_id});
    } else {
        return db.any("SELECT * FROM ${examid^}.questions", {examid: 'exam_' +exam_id})
    }
};

exports.createQuestion = function(exam_id, number, body_text, author, parent_question) {
    var insertQuestion = sql('./sql/insertQuestion.sql');

    return db.none(insertQuestion, {
        exam_id: 'exam_' + exam_id,
        number: number,
        body_text: body_text,
        author: author,
        parent_question: parent_question
        });
};

exports.getQuestion = function(exam_id, question_id) {
    return db.oneOrNone("SELECT * FROM ${exam_id^}.questions WHERE ID=${question_id}", {exam_id: 'exam_' + exam_id, question_id: question_id})
};
