/**
 * Created by liam on 25/11/16.
 */


var pgp = require('pg-promise')();
var path = require('path')

var config = {
    host: 'localhost',
    port: 5432,
    database: 'api',
    user: 'postgres'
};

function sql(file) {
    // consider using here: path.join(__dirname, file)
    return new pgp.QueryFile(path.join(__dirname, file), {minify: true});
}


exports.db = pgp(config);
exports.sql = sql;
