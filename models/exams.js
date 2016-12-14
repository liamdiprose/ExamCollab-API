/**
 * Created by liam on 23/11/16.
 */


var database = require('./database');
var db = database.db;
var sql = database.sql;

exports.getAllExams = function() {
    return db.any("SELECT * FROM public.exams");
};

exports.createExam = function(shortName, name, room, date, duration) {
    var vals = {
        shortName: shortName
    };

    var new_exam_entry_return_id = sql('./sql/createExamEntry.sql');

    return db.one(new_exam_entry_return_id, vals);
};

exports.getExam = function(exam_id) {
    return db.one("SELECT * FROM public.exams WHERE id=${id}", {id: exam_id});
};

exports.deleteExam = function(exam_id) {
    return db.none("DELETE FROM public.exams WHERE id=${id}", {id: exam_id});
    // TODO: Error on delete of non-existant exam?
};

// TODO UPDATE
