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

    var sqlCount = mustache.render('select count(*) as total from sanpham where danhmuc = {{id}}', view);
    promises.push(db.load(sqlCount));

    var sql = mustache.render('select * from sanpham where danhmuc = {{id}} limit {{limit}} offset {{offset}}', view);
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

    var sql = 'select * from sanpham where danhmuc = ' + id;
    db.load(sql).then(function(rows) {
        deferred.resolve(rows);
    });

    return deferred.promise;
}

exports.loadDetail = function(id, isLoggedin, accId) {

    var deferred = Q.defer();

    var promises = [];

    var sql = 'select * from (select * from sanpham, taikhoan where manguoiban = id and madaugia = ' + id + ') as sp left join (select ten as tennguoitragia, sanpham, gia from tragia, taikhoan where nguoitragia = id order by gia desc) as tg on sp.madaugia = tg.sanpham';
    if (!isLoggedin) {
        db.load(sql).then(function(rows) {
            if (rows) {
                deferred.resolve(rows[0]);
            } else {
                deferred.resolve(null);
            }
        });
    }
    else {
        var sqlWatching = 'select * from theodoi where nguoitheodoi = ' + accId + ' and sanpham = ' + id;

        promises.push(db.load(sql));
        promises.push(db.load(sqlWatching));

        Q.all(promises).spread(function(product, wtchng) {
            var theodoi = 'Theo dõi';
            if (wtchng.length > 0)
                theodoi = 'Bỏ theo dõi';
            var data = {
                pro: product[0],
                watching: theodoi
            }
            deferred.resolve(data);
        });
    }

    return deferred.promise;
}

exports.loadProductbyId = function(id) {
    var deferred = Q.defer();
    var sql = 'select * from sanpham where madaugia = ' + id;
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
    var sql = 'select * from sanpham where tgketthuc > now() order by solandaugia desc limit 6';
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
    var sql = 'select * from sanpham where tgketthuc > now() order by giahientai desc limit 6';
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

exports.insertTheoDoi = function(idnguoitheodoi, idsanpham) {
    var deferred = Q.defer();
    var sql = 'insert into theodoi values("' + idnguoitheodoi + '", "' + idsanpham + '")';
    db.insert(sql).then(function(insertId) {
        deferred.resolve(insertId);
    });

    return deferred.promise;
}

exports.insertTraGia = function(idnguoitragia, idsanpham, entity) {
    var deferred = Q.defer();

    var currentdate = new Date(); 
    var datetime = + currentdate.getFullYear() + "-"
                + (currentdate.getMonth() + 1) + "-"
                + currentdate.getDate() + " "
                + currentdate.getHours() + ":"
                + currentdate.getMinutes() + ":"
                + currentdate.getSeconds();

    var sql = mustache.render('insert into tragia values("' + idnguoitragia + '", "' + idsanpham + '", "{{giaphaitra}}", "' + datetime + '")', entity);
    db.insert(sql).then(function(insertId) {
        deferred.resolve(insertId);
    });

    return deferred.promise;
}

exports.updateGiaHienTai = function(idsanpham, entity) {
    var deferred = Q.defer();

    var sql = mustache.render('update sanpham set giahientai = {{giaphaitra}} where madaugia = ' + idsanpham, entity);
    db.update(sql).then(function(changedRows) {
        deferred.resolve(changedRows);
    });

    return deferred.promise;
}
//hàm lấy danh sách sản phẩm dựa trên từ khóa, loại sản phẩm
exports.searchProduct = function(word, cat, orderBy, limit, offset) {
    var deferred = Q.defer();

    var entity = {
        limit: limit,
        offset: offset,
        orderBy: orderBy,
        word: word, 
        cat: cat
    };
    var promises = [];
    
    var sql_1 = mustache.render('SELECT COUNT(*) as total from sanpham sp, danhmuc dm, taikhoan tk where sp.tensp LIKE CONCAT("%","{{word}}" ,"%") and sp.danhmuc={{cat}} and dm.id = sp.danhmuc and sp.manguoiban = tk.id ORDER BY {{orderBy}}', entity);
    promises.push(db.load(sql_1));

    var sql_2 = mustache.render('SELECT sp.*, dm.tendanhmuc, tk.ten from sanpham sp, danhmuc dm, taikhoan tk where sp.tensp LIKE CONCAT("%","{{word}}" ,"%") and sp.danhmuc={{cat}} and dm.id = sp.danhmuc and sp.manguoiban = tk.id ORDER BY {{orderBy}} LIMIT {{limit}} OFFSET {{offset}}', entity);
    promises.push(db.load(sql_2));

    Q.all(promises).spread(function(totalRow, rows) {
        var data = {
            total: totalRow[0].total,
            rows: rows
        }
        deferred.resolve(data);
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
