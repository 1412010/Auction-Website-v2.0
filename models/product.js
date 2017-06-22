var Q = require('q');
var mustache = require('mustache');
var db = require('../app-helpers/dbHelper');

exports.loadPageByCat = function(id, limit, offset) {

    var deferred = Q.defer();

    var promises = [];

    var view = {
        id: id,
        limit: limit,
        offset: offset
    };

    var sqlCount = mustache.render('select count(*) as total from products where CatID = {{id}}', view);
    promises.push(db.load(sqlCount));

    var sql = mustache.render('select * from products where CatID = {{id}} limit {{limit}} offset {{offset}}', view);
    promises.push(db.load(sql));

    Q.all(promises).spread(function(totalRow, rows) {
        var data = {
            total: totalRow[0].total,
            list: rows
        }
        deferred.resolve(data);
    });

    return deferred.promise;
}

exports.loadAllByCat = function(id) {

    var deferred = Q.defer();

    var sql = 'select * from products where CatID = ' + id;
    db.load(sql).then(function(rows) {
        deferred.resolve(rows);
    });

    return deferred.promise;
}

exports.loadDetail = function(id) {

    var deferred = Q.defer();

    var sql = 'select * from products where ProID = ' + id;
    db.load(sql).then(function(rows) {
        if (rows) {
            deferred.resolve(rows[0]);
        } else {
            deferred.resolve(null);
        }
    });

    return deferred.promise;
}

exports.loadTopRaGia = function() {
    var deferred = Q.defer();
    var sql = 'select * from sanpham order by solandaugia desc limit 6';
    db.load(sql).then(function(rows) {
        if (rows) {
            deferred.resolve(rows);
        } else {
            deferred.resolve(null);
        }
    });

    return deferred.promise;
}

exports.loadTopGiaCao = function() {
    var deferred = Q.defer();
    var sql = 'select * from sanpham order by giahientai desc limit 6';
    db.load(sql).then(function(rows) {
        if (rows) {
            deferred.resolve(rows);
        } else {
            deferred.resolve(null);
        }
    });

    return deferred.promise;
}

exports.loadGanKetThuc = function() {
    var deferred = Q.defer();
    var sql = 'select * from sanpham where tgketthuc > now() order by tgketthuc asc limit 6';
    db.load(sql).then(function(rows) {
        if (rows) {
            deferred.resolve(rows);
        } else {
            deferred.resolve(null);
        }
    });

    return deferred.promise;
}

// exports.makeCartItem = function(id, q) {

//     var deferred = Q.defer();

//     var sql = 'select * from products where ProID = ' + id;
//     db.load(sql).then(function(rows) {
//         if (rows) {
//             var ret = {
//                 Product: rows[0],
//                 Quantity: q,
//                 Amount: rows[0].Price * q
//             }
//             deferred.resolve(ret);
//         } else {
//             deferred.resolve(null);
//         }
//     });

//     return deferred.promise;
// }