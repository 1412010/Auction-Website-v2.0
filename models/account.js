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
    var sql = mustache.render('SELECT tb1.*, tk1.ten as tengiugia From (SELECT sp.*, dm.tendanhmuc, tk.ten as tennguoiban From theodoi td, sanpham sp, danhmuc dm, taikhoan tk where td.nguoitheodoi = {{id}} and td.sanpham = sp.madaugia and sp.danhmuc = dm.id and tk.id = sp.manguoiban) tb1 LEFT JOIN taikhoan tk1 on tk1.id = tb1.nguoigiugia', entity);

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
    db.load(sql).then(function(rows) {
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
        if (rows.length > 0) {
            deferred.resolve(rows[0]);
        } else {
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
        if (rows.length > 0) {
            deferred.resolve(true);
        } else {
            deferred.resolve(false);
        }
    });

    return deferred.promise;
}

exports.getRateDetail = function(id) {
    var deferred = Q.defer();
    var promises = [];
    var entity = {
        id: id
    };
    var sqlcount = mustache.render('select count(*) as total from ketquadaugia where nguoiban = {{id}} or nguoimua = {{id}}', entity);
    //console.log(sqlcount);
    promises.push(db.load(sqlcount));

    var sql2 = mustache.render('select kq.*, tknguoimua.ten as tennguoimua, tknguoiban.ten as tennguoiban from ketquadaugia kq, taikhoan tknguoimua, taikhoan tknguoiban where (kq.nguoiban = {{id}} or kq.nguoimua = {{id}}) and tknguoimua.id = kq.nguoimua and tknguoiban.id = kq.nguoiban', entity);
    //console.log(sql2);
    promises.push(db.load(sql2));

    Q.all(promises).spread(function(totalRow, rows) {
        var data = {
            total: totalRow[0].total,
            list: rows
        }
        deferred.resolve(data);
    });

    return deferred.promise;
}

exports.getBidingList = function(id) {
    var deferred = Q.defer();

    var entity = {
        id: id
    };

    var sql = mustache.render('select tb1.*, tk.ten as tennguoigiugia from taikhoan tk right Join (select sp.*, dm.tendanhmuc, tk1.ten as tennguoiban from sanpham sp, tragia tg, danhmuc dm, taikhoan tk1 where sp.madaugia = tg.sanpham and sp.tgketthuc > now() and tg.nguoitragia = {{id}} and dm.id = sp.danhmuc  and tk1.id = sp.manguoiban) tb1 on tb1.nguoigiugia = tk.id ', entity);
    db.load(sql).then(function(rows) {
        deferred.resolve(rows);
    });
    return deferred.promise;
}


exports.getWonList = function(id) {
    var deferred = Q.defer();

    var entity = {
        id: id
    };

    var sql = mustache.render('select sp.*, tk.id, tk.ten as tennguoiban from sanpham sp, ketquadaugia kq, taikhoan tk where kq.nguoimua = {{id}} and kq.sanpham = sp.madaugia and tk.id = sp.manguoiban ', entity);
    db.load(sql).then(function(rows) {
        deferred.resolve(rows);
    });
    return deferred.promise;
}

exports.getSellingList = function(id) {
    var deferred = Q.defer();

    var entity = {
        id: id
    };

    var sql = mustache.render('select tb1.*, tk.ten as tennguoigiugia from taikhoan tk right Join (select sp.*, dm.tendanhmuc, tk1.ten as tennguoiban from sanpham sp, danhmuc dm, taikhoan tk1 where  sp.tgketthuc > now()  and dm.id = sp.danhmuc and tk1.id = sp.manguoiban and sp.manguoiban = {{id}}) tb1 on tb1.nguoigiugia = tk.id', entity);
    db.load(sql).then(function(rows) {
        deferred.resolve(rows);
    });
    return deferred.promise;
}

exports.getSoldList = function(id) {
    var deferred = Q.defer();

    var entity = {
        id: id
    };

    var sql = mustache.render('select sp.*, tk.id, tk.ten as tennguoimua  from sanpham sp, ketquadaugia kq, taikhoan tk where kq.nguoiban = {{id}} and kq.sanpham = sp.madaugia and tk.id = kq.nguoimua', entity);
    db.load(sql).then(function(rows) {
        deferred.resolve(rows);
    });
    return deferred.promise;
}
exports.insertNewPer = function(id) {
    var deferred = Q.defer();
    var date = moment().format('YYYY-MM-DD HH:mm');
    var entity = {
        id: id,
        date: date
    };

    var sql = mustache.render('insert xinduocban(nguoixin, thoigianxin) values( {{id}},"{{date}}" )', entity);
    console.log(sql);
    db.insert(sql).then(function(insertId) {
        deferred.resolve(insertId);
    });
    return deferred.promise;
}

exports.daDanhGiaNguoiBan = function(entity) {
    var deferred = Q.defer();

    var sql = mustache.render('select * from ketquadaugia where sanpham = {{idPro}} and ngmuanhanxet is null', entity);
    console.log(sql);
    db.load(sql).then(function(rows) {
        if (rows.length > 0)
        {
            deferred.resolve(false);
        }
        else
        {
            deferred.resolve(true);
        }
    });
    return deferred.promise;
}

exports.daDanhGiaNguoiMua = function(entity) {
    var deferred = Q.defer();

    var sql = mustache.render('select * from ketquadaugia where sanpham = {{idPro}} and ngbannhanxet is null', entity);
    console.log(sql);
    db.load(sql).then(function(rows) {
        if (rows.length > 0)
        {
            deferred.resolve(false);
        }
        else
        {
            deferred.resolve(true);
        }
    });
    return deferred.promise;
}

exports.updateDanhGiaNguoiBan = function(entity) {
    var deferred = Q.defer();

    var sql = mustache.render('update ketquadaugia set ngmuanhanxet = "{{nx}}", ngmuacongdiem={{diem}} where sanpham = {{idPro}}', entity);
    console.log(sql);
    db.update(sql).then(function(changedRows) {
        deferred.resolve(changedRows);
    });
    return deferred.promise;
}

exports.updateDanhGiaNguoiMua = function(entity) {
    var deferred = Q.defer();

    var sql = mustache.render('update ketquadaugia set ngbannhanxet = "{{nx}}", ngbancongdiem={{diem}} where sanpham = {{idPro}}', entity);
    console.log(sql);
    db.update(sql).then(function(changedRows) {
        deferred.resolve(changedRows);
    });
    return deferred.promise;
}
