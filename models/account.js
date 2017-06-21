var Q = require('q');
var mustache = require('mustache');

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