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

    console.log("Getting all answers...");

    if (options.visible) {
        return db.any("SELECT * FROM ${exam_id^}.answers WHERE superceded_by IS NULL;", {exam_id: 'exam_' + exam_id});
    } else {
        return db.any("SELECT * FROM ${exam_id^}.answers;", {exam_id: 'exam_' + exam_id});
    }
};

exports.getAnswer = function(exam_id, answer_id) {
    return db.one("SELECT * FROM ${exam_id^}.answers WHERE id=${answer_id};", {exam_id: 'exam_'+exam_id, answer_id: answer_id});
};

exports.createAnswer = function (exam_id, parent_question, author, body_text) {
    var insertAnswer = sql('./sql/insertAnswer.sql');
    var vals = {
        exam_id: 'exam_' + exam_id,
        parent_question: parent_question,
        author: author,
        body_text: body_text
    };

    return db.one(insertAnswer, vals);
};
exports.upvoteAnswer = function(exam_id, user, answer) {
    //var vote = sql('./sql/voteAnswer.sql');
    return db.none("vote_answer(${exam_id}, ${user}, ${answer_id}, ${is_upvote});", {exam_id: exam_id, user: user, answer_id: answer, is_upvote: true});
};

exports.downvoteAnswer = function(exam_id, user, answer) {
    //var vote = sql('./sql/voteAnswer.sql');
    return db.none("vote_answer(${exam_id}, ${user}, ${answer_id}, ${is_upvote});", {exam_id: exam_id, user: user, answer_id: answer, is_upvote: false});
};
