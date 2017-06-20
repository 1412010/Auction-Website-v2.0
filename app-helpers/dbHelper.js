var Q = require('q');
var mysql = require('mysql');

var HOST = '127.0.0.1',
    DB = 'qldaugia',
    USER = 'root',
    PWD = '';

function connect() {

    var deferred = Q.defer();

    var cn = mysql.createConnection({
        host: HOST,
        user: USER,
        password: PWD,
        database: DB
    });

    cn.connect(function(err) {
        if (err) throw err;
        deferred.resolve(cn);
    });

    return deferred.promise;
}

exports.load = function(sql) {

    var deferred = Q.defer();

    connect().then(function(cn) {
        cn.query(sql, function(err, rows, fields) {
            if (err) throw err;
            deferred.resolve(rows);
        });
    });

    return deferred.promise;
}

exports.insert = function(sql) {

    var deferred = Q.defer();

    connect().then(function(cn) {
        cn.query(sql, function(err, res) {
            if (err) throw err;
            deferred.resolve(res.insertId);
        });
    });

    return deferred.promise;
}

exports.update = function(sql) {

    var deferred = Q.defer();

    connect().then(function(cn) {
        cn.query(sql, function(err, res) {
            if (err) throw err;
            deferred.resolve(res.changedRows);
        });
    });

    return deferred.promise;
}

exports.delete = function(sql) {

    var deferred = Q.defer();

    connect().then(function(cn) {
        cn.query(sql, function(err, res) {
            if (err) throw err;
            deferred.resolve(res.affectedRows);
        });
    });

    return deferred.promise;
}

// exports.escape = function(p) {
//     return mysql.escape(p);
// }