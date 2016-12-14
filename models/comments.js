
var database = require('./database');
var db = database.db;


class CommentModel {
    constructor(parent, text, author) {
        this.parent = parent;
        this.text = text;
        this.author = author;
    }
}
function getAllComments(exam_id) {
    return db.any("SELECT * FROM ${exam_id^}.comments", {exam_id: 'exam_' + exam_id});
}

function getQuestionComments(exam_id, question_id) {
    // TODO: get comments from exam_id and question_id
    return db.any("SELECT * FROM ${exam_id^}.comments WHERE parent_question=${question_id}", {exam_id: 'exam_' + exam_id, question_id: question_id})
}

function getAnswerComments(exam_id, answer_id) {
    // TODO: get comments from exam_id and answer_id
    return db.any("SELECT * FROM ${exam_id^}.comments WHERE parent_answer=${answer_id}", {exam_id: 'exam_' + exam_id, answer_id: answer_id})
}

function insertAnswerComment(exam_id, answer_id, comment, author) {
    // TODO: insert comment for answer
    return db.any("INSERT INTO ${exam_id^}.comments (body_text,author,parent_answer) VALUES (${comment}, ${author}, ${answer_id})", {exam_id: 'exam_' + exam_id,
    comment: comment,
    author: author,
    answer_id: answer_id});
}

function insertQuestionComment(exam_id, question_id, comment) {
    // TODO: insert comment for question
}

function updateComment(exam_id, comment_id, new_comment) {
    // TODO: update comment for question
}

function deleteComment(exam_id, comment_id) {
    // TODO: delete comment from id
}

module.exports = {
    Model: CommentModel,
    getAllComments: getAllComments,
    getQuestionComments: getQuestionComments,
    getAnswerComments: getAnswerComments,
    insertQuestionComment: insertQuestionComment,
    insertAnswerComment: insertAnswerComment,
    updateComment: updateComment,
    deleteComment: deleteComment
};
