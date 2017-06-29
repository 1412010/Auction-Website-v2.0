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

exports.updateInfo = function(entity) {
    var deferred = Q.defer();

    var sql = mustache.render('UPDATE taikhoan SET ten = "{{name}}", ngaysinh="{{dob}}", gioitinh={{gender}} WHERE id={{id}}', entity);
    db.update(sql).then(function(result) {
        if (result > 0) {
            var sql_2 = mustache.render('SELECT * FROM taikhoan WHERE id={{id}}', entity);
            db.load(sql_2).then(function(rows) {
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
            });
        } else {
            deferred.resolve(null);
        }
    });
    return deferred.promise;
}

exports.updatePassword = function(pw) {
    var deferred = Q.defer();
    var sql = mustache.render('SELECT * FROM taikhoan WHERE id={{id}}', pw);
    db.load(sql).then(function(rows) {
        if (pw.oldPW == rows[0].matkhau) {
            var sql2 = mustache.render('UPDATE taikhoan SET matkhau="{{newPW}}" WHERE id={{id}}', pw);
            db.update(sql2).then(function(result) {
                if (result > 0) {
                    deferred.resolve(1);
                } else {
                    deferred.resolve(0);
                }
            });
        } else {
            deferred.resolve(0);
        }
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
    db.update(sql1).then(function(changedRows1) {
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

exports.getWatchingList = function(id) {
    var deferred = Q.defer();
    var entity = {
        id: id
    };
    var sql = mustache.render('select tb1.*, tb2.id, tb2.ten as nguoitragia from (SELECT sp.*, tk2.ten FROM taikhoan tk1, sanpham sp, taikhoan tk2 where tk1.id={{id}} and tk2.id = sp.manguoiban   and tk1.id in (select td.nguoitheodoi from theodoi td) and sp.madaugia in (select td.sanpham from theodoi td)) tb1 left join (select tk3.id, tk3.ten, tg.gia, tg.sanpham from taikhoan tk3, tragia tg where tk3.id = tg.nguoitragia) tb2 on tb1.giahientai = tb2.gia and tb2.sanpham = tb1.madaugia', entity);

    db.load(sql).then(function(rows) {
        deferred.resolve(rows);
    });
    return deferred.promise;
}

exports.isPermittedToSell = function(id) {
    var deferred = Q.defer();
    var entity = {
        id: id
    };
    var sql = mustache.render('select xb.nguoixin from xinduocban xb, taikhoan tk where tk.id={{id}}  and xb.nguoixin = tk.id and xb.trangthai = 1 and xb.thoigianhet >= now()', entity);
    console.log(sql);
    db.load(sql).then(function(rows){
        console.log(rows);
        if (rows.length > 0) {
            console.log('true');
            deferred.resolve(true);
        } else deferred.resolve(false);
    });
    return deferred.promise;
}

exports.getEmailById = function(id) {
    var deferred = Q.defer();

    var sql = 'select email from taikhoan where id =' + id;

    db.load(sql).then(function(rows) {
        if (rows.length > 0)
        {
            deferred.resolve(rows[0]);
        }
        else
        {
             deferred.resolve(null);
        }
    });

    return deferred.promise;
}

exports.isEmailExisted = function(entity) {
    var deferred = Q.defer();

    var sql = mustache.render('select * from taikhoan where email = "{{email}}"', entity);
    console.log(sql);
    db.load(sql).then(function(rows) {
        if (rows.length > 0)
        {
            deferred.resolve(true);
        }
        else
        {
             deferred.resolve(false);
        }
    });

    return deferred.promise;
}

