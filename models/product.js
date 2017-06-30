var Q = require('q');
var mustache = require('mustache');
var db = require('../app-helpers/dbHelper');


exports.newProduct = function(entity) {
    var deferred = Q.defer();

    var sql = mustache.render('INSERT INTO sanpham (tensp, giahientai, giamuangay, tgbatdau, tgketthuc, trangthai, thongtin,    manguoiban, danhmuc, mota, giakhoidiem, buocgia,tudonggiahan )VALUES ("{{tensp}}", {{giakhoidiem}}, {{giamuangay}}, "{{tgbatdau}}", "{{tgketthuc}}", 1, "{{{thongtin}}}", {{nguoiban}}, {{loaisp}}, "{{mota}}", {{giakhoidiem}}, {{buocgia}}, {{cogiahan}})', entity);

    db.insert(sql).then(function(rowid) {
        deferred.resolve(rowid);
    });
 
    return deferred.promise;
 }
 
exports.updateProduct = function(entity) {
    var deferred = Q.defer();

    var sql = mustache.render('UPDATE sanpham set thongtin = "{{{thongtin}}}" where madaugia={{id}}', entity);

    db.update(sql).then(function(changedRows) {
        deferred.resolve(changedRows);
    });

    return deferred.promise;
}

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

exports.loadSellerByProductId = function(id) {
    var deferred = Q.defer();
    var entity = {
        id: id
    };
    var sql = mustache.render('SELECT sp.madaugia, tk.* FROM sanpham sp, taikhoan tk WHERE sp.manguoiban=tk.id and sp.madaugia={{id}}', entity);
    db.load(sql).then(function(rows) {
        if (rows.length > 0) {
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

exports.updateDatGiaHienTai = function(idsanpham, entity) {
    var deferred = Q.defer();

    var sql = mustache.render('update sanpham set giahientai = {{giaphaitra}}, solandaugia = solandaugia + 1, nguoigiugia = {{nguoigiugia}} where madaugia = ' + idsanpham, entity);
    db.update(sql).then(function(changedRows) {
        deferred.resolve(changedRows);
    });

    return deferred.promise;
}

exports.loadBidLogById = function(id) {
    var deferred = Q.defer();
    var sql = 'select * from taikhoan, tragia where sanpham = '+ id + ' and id = nguoitragia order by thoigiantra desc';
    db.load(sql).then(function(rows) {
        if (rows) {
            deferred.resolve(rows);
        } else {
            deferred.resolve(null);
        }
    });

    return deferred.promise;
}

exports.loadCamDauGia = function(tk, sp) {
    var deferred = Q.defer();
    var sql = 'select * from camdaugia where sanpham = '+ sp + ' and taikhoan = ' + tk;
    db.load(sql).then(function(rows) {
        if (rows) {
            deferred.resolve(rows);
        } else {
            deferred.resolve(null);
        }
    });

    return deferred.promise;
}

exports.loadHetHan = function(id) {
    var deferred = Q.defer();

    var currentdate = new Date(); 
    var datetime = + currentdate.getFullYear() + "-"
                + (currentdate.getMonth() + 1) + "-"
                + currentdate.getDate() + " "
                + currentdate.getHours() + ":"
                + currentdate.getMinutes() + ":"
                + currentdate.getSeconds();

    var sql = 'select * from sanpham where madaugia = '+ id + ' and tgketthuc < "' + datetime + '"';
    db.load(sql).then(function(rows) {
        if (rows.length > 0) {
            deferred.resolve(rows);
        } else {
            deferred.resolve(null);
        }
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

exports.insertCamDauGia = function(tk, sp) {
    var deferred = Q.defer();
    var sql = 'insert into camdaugia values("' + sp + '", "' + tk + '")';
    db.insert(sql).then(function(insertId) {
        deferred.resolve(insertId);
    });

    return deferred.promise;
}

exports.deleteTraGia = function(tk, sp) {
    var deferred = Q.defer();

    var sql = 'delete from tragia where nguoitragia = ' + tk + ' and sanpham = ' + sp;
    db.delete(sql).then(function(affectedRows) {
        deferred.resolve(affectedRows);
    });

    return deferred.promise;
}

exports.updateNguoiGiuGia = function(tk, sp, gia) {
    var deferred = Q.defer();

    var sql = 'update sanpham set giahientai = ' + gia + ', nguoigiugia = ' + tk + ' where madaugia = ' + sp;
    db.update(sql).then(function(changedRows) {
        deferred.resolve(changedRows);
    });

    return deferred.promise;
}

exports.loadTraGia = function(sp) {
    var deferred = Q.defer();
    var sql = 'select * from tragia where sanpham = '+ sp + ' order by gia desc';
    db.load(sql).then(function(rows) {
        if (rows.length > 0) {
            deferred.resolve(rows[0]);
        } else {
            deferred.resolve(null);
        }
    });

    return deferred.promise;
}

exports.updateSanPhamMuaNgay = function(tk, sp) {
    var deferred = Q.defer();

    var sql = 'update sanpham set giahientai = giamuangay, nguoigiugia = ' + tk + ' where madaugia = ' + sp;
    db.update(sql).then(function(changedRows) {
        deferred.resolve(changedRows);
    });

    return deferred.promise;
}
