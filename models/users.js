/**
 * Created by liam on 23/11/16.
 */

var database = require("./database");
var db = database.db;
var sql = database.sql;

exports.getUserByToken = function (exam, token) {
    if (exam) {
        var vals = {
            schema: 'exam_' + exam,
            token: token
        };
        console.log("Checking users table in " + vals.schema);
        return db.oneOrNone("SELECT id,permission_level FROM ${schema^}.users WHERE secret_token=${token}", vals);
    } else {
        // Use globals users
        return db.oneOrNone("SELECT id, permission_level FROM public.users WHERE secret_token=${token}", {token: token});
    }
};


exports.getAllUsers = function(exam_id) {
    return db.any("SELECT * FROM ${exam_id^}.users", {exam_id: 'exam_' + exam_id});
};

exports.createUser = function(exam_id, name_noun, name_color, uuid, perm_level) {
    var insertUser = sql('./sql/insertUser.sql');
    return db.one(insertUser, {
        exam_id: 'exam_' + exam_id,
        name_noun: name_noun,
        uuid: uuid,
        permission_level: perm_level,
        name_color: name_color
    });
};

exports.roles = Object.freeze({
    guest:      0,
    member:     1,
    moderator:  2,
    owner:      3,
    admin:      4
});
