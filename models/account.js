var Q = require('q');
var mustache = require('mustache');
var moment = require('moment');

var db = require('../app-helpers/dbHelper');

exports.insert = function(entity) {

    var deferred = Q.defer();

    var sql =
        mustache.render(
            'insert into taikhoan (matkhau, ten, email, ngaysinh, quyenhan, gioitinh) values ( "{{password}}", "{{name}}", "{{email}}", "{{dob}}", {{permission}}, {{gender}})',
            entity
        );

    db.insert(sql).then(function(insertId) {
        deferred.resolve(insertId);
    });

    return deferred.promise;
}

exports.login = function(entity) {

    var deferred = Q.defer();

    var sql =
        mustache.render(
            'select * from taikhoan where email = "{{email}}" and matkhau = "{{password}}"',
            entity
        );

    db.load(sql).then(function(rows) {
        if (rows.length > 0) {
            console.log(rows[0].diemcong);
            var account = {
                id: rows[0].id,
                //username: rows[0].f_Username,
                name: rows[0].ten,
                email: rows[0].email,
                dob: rows[0].ngaysinh,
                permission: rows[0].quyenhan,
                gender: rows[0].gioitinh,
                positivepoint: rows[0].diemcong,
                negativepoint: rows[0].diemtru,
            }
            deferred.resolve(account);
        } else {
            deferred.resolve(null);
        }
    });

    return deferred.promise;
}

exports.loadAll = function() {

    var deferred = Q.defer();

    var sql = 'select * from qldaugia.taikhoan where quyenhan != 4';
    db.load(sql).then(function(rows) {
        deferred.resolve(rows);
    });

    return deferred.promise;
}

exports.delete = function(entity) {
    var deferred = Q.defer();

    var sql = mustache.render(
        'delete from taikhoan where id = {{id}}',
        entity
    );

    db.delete(sql).then(function(affectedRows) {
        deferred.resolve(affectedRows);
    });

    return deferred.promise;
}

exports.reset = function(entity) {
    var deferred = Q.defer();

    var sql = mustache.render(
        'update taikhoan set matkhau="{{pass}}" where id={{id}}',
        entity
    );

    db.update(sql).then(function(changedRows) {
        deferred.resolve(changedRows);
    });

    return deferred.promise;
}

exports.loadApproval = function() {

    var deferred = Q.defer();

    var sql = 'select tk.email, tk.ten, xb.id, xb.thoigianxin, xb.nguoixin from taikhoan tk, xinduocban xb where tk.id = xb.nguoixin and xb.trangthai = 0 order by xb.thoigianxin asc ';
    db.load(sql).then(function(rows) {
        deferred.resolve(rows);
    });

    return deferred.promise;
}

exports.updateApproval = function(id) {
    var deferred = Q.defer();
    var temp = moment() + (1000 * 3600 * 24 * 7); 
    var entity = {
        id: id,
        date: moment(temp).format('YYYY-MM-DD')
    };
    var sql1 = mustache.render(
        'update xinduocban set trangthai = 1, thoigianhet = "{{date}}" where id = {{id}}',
        entity
    ); 
    db.update(sql1).then(function (changedRows1){
        var sql2 = 'select nguoixin from xinduocban where id =' + id;
        db.load(sql2).then(function(rows) {
            var nguoixin = rows[0].nguoixin;
            var sql3 = 'update taikhoan set quyenhan = 1 where id =' + nguoixin;
            db.update(sql3).then(function(changedRows2) {
                deferred.resolve(changedRows1);
            });
        });
    });
    return deferred.promise;
}