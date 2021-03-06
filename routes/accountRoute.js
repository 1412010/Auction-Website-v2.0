var express = require('express');
var crypto = require('crypto');
var moment = require('moment');
var multer = require('multer');
var fs = require('fs');
var restrict = require('../middle-wares/restrict');
var account = require('../models/account');
var product = require('../models/product');
var mkdirp = require('mkdirp');
var mv = require('mv');
var mime = require('mime');
var srcdir = './public/Imgs/temp';
var destdir = './public/Imgs/sp/';
var accountRoute = express.Router();
var name = ['main_thumbs', 'main', '1_thumbs', '1'];
var count = -1;
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        mkdirp(srcdir, function(err) {
            console.log('created temp folder');
        });
        cb(null, srcdir);
    },
    filename: function(req, file, cb) {
        count++;
        if (count > 3) {
            count = 0;
        }

        cb(null, name[count] + '.' + mime.extension(file.mimetype));
    }
})

var upload = multer({ storage: storage });

accountRoute.get('/login', function(req, res) {
    if (req.session.isLogged === true) {
        res.redirect('/home');
    } else {
        res.render('account/login', {
            layoutModels: res.locals.layoutModels,
            showError: false,
            errorMsg: ''
        });
    }
});

//2
accountRoute.post('/login', function(req, res) {

    var ePWD = crypto.createHash('md5').update(req.body.password).digest('hex');
    var entity = {
        email: req.body.email,
        password: ePWD,
    };

    var remember = req.body.remember ? true : false;

    account.login(entity)
        .then(function(account) {
            if (account === null) {
                res.render('account/login', {
                    layoutModels: res.locals.layoutModels,
                    showError: true,
                    errorMsg: 'Thông tin đăng nhập không đúng.'
                });
            } else {
                account.dob = moment(account.dob, 'YYYY-MM-DDTHH:mm').format('DD-MM-YYYY');
                req.session.isLogged = true;
                req.session.account = account;
                //req.session.cart = [];

                if (remember === true) {
                    var hour = 1000 * 60 * 60 * 24;
                    req.session.cookie.expires = new Date(Date.now() + hour);
                    req.session.cookie.maxAge = hour;
                }

                var url = '/home';
                //console.log(req.query.retUrl);
                if (req.query.retUrl) {
                    url = req.query.retUrl;
                }
                res.redirect(url);
            }
        });
});

accountRoute.post('/logout', restrict, function(req, res) {
    req.session.isLogged = false;
    req.session.account = null;
    req.session.cart = null;
    req.session.cookie.expires = new Date(Date.now() - 1000);
    res.redirect(req.headers.referer);
});

accountRoute.get('/register', function(req, res) {
    res.render('account/register', {
        layoutModels: res.locals.layoutModels,
        showError: false,
        errorMsg: ''
    });
});

accountRoute.post('/register', function(req, res) {

    var ePWD = crypto.createHash('md5').update(req.body.rawPWD).digest('hex');
    var nDOB = moment(req.body.dob, 'DD-MM-YYYY').format('YYYY-MM-DDTHH:mm');
    var ngender = req.body.radioGender;
    var entity = {
        //username: req.body.username,
        password: ePWD,
        name: req.body.name,
        email: req.body.email,
        dob: nDOB,
        permission: 0,
        gender: ngender
    };
    account.isEmailExisted(entity)
        .then(function(result) {
            console.log(result);
            if (result) {
                res.render('account/register', {
                    layoutModels: res.locals.layoutModels,
                    showError: true,
                    errorMsg: 'Đăng ký thất bại. Email đã tồn tại.'
                });
            } else {
                account.insert(entity)
                    .then(function(insertId) {
                        res.render('account/register', {
                            layoutModels: res.locals.layoutModels,
                            showError: true,
                            errorMsg: 'Đăng ký thành công.'
                        });
                    });
            }
        });

});

//Thay đổi thông tin người dùng
accountRoute.post('/profile', function(req, res) {
    var dateOB = moment(req.body.dob, 'DD-MM-YYYY').format('YYYY-MM-DD');
    console.log(dateOB);
    var entity = {
        id: req.body.id,
        name: req.body.name,
        gender: req.body.gender,
        dob: dateOB
    };

    account.updateInfo(entity).then(function(account) {
        res.locals.layoutModels.account = account;
        req.session.account = account;
        console.log(account);
        res.render('account/profile', {
            layoutModels: res.locals.layoutModels,
            showError: true,
            errorMsg: 'Cập nhật thông tin thành công'
        });
    });
});

accountRoute.get('/profile', restrict, function(req, res) {
    res.render('account/profile', {
        layoutModels: res.locals.layoutModels
    });
});

accountRoute.get('/changePassword', restrict, function(req, res) {
    res.render('account/changePassword', {
        layoutModels: res.locals.layoutModels
    });
});

accountRoute.post('/changePassword', restrict, function(req, res) {
    var crytoOldPW = crypto.createHash('md5').update(req.body.oldPW).digest('hex');
    var crytoNewPW = crypto.createHash('md5').update(req.body.newPW).digest('hex');
    var crytoRenewPW = crypto.createHash('md5').update(req.body.renewPW).digest('hex');
    console.log(crytoOldPW);
    console.log(crytoNewPW);
    console.log(crytoRenewPW);
    var pw = {
        id: res.locals.layoutModels.account.id,
        oldPW: crytoOldPW,
        newPW: crytoNewPW
    };
    account.updatePassword(pw).then(function(result) {
        if (result == 1) {
            res.render('account/changePassword', {
                layoutModels: res.locals.layoutModels,
                successMsg: true,
                errorMsg: 'Mật khẩu đã được thay đổi thành công.'
            });
        } else {
            res.render('account/changePassword', {
                layoutModels: res.locals.layoutModels,
                failMsg: true,
                errorMsg: 'Mật khẩu cũ không khớp. Vui lòng nhập lại'
            });
        }

    });
});

accountRoute.get('/watching', restrict, function(req, res) {
    account.getWatchingList(res.locals.layoutModels.account.id).then(function(rows) {
        console.log(rows);
        res.render('account/watchingList', {
            layoutModels: res.locals.layoutModels,
            isEmpty: rows.length > 0 ? false : true,
            rows: rows
        });
    });
});

accountRoute.get('/newAuction', restrict, function(req, res) {
    account.isPermittedToSell(res.locals.layoutModels.account.id).then(function(result) {
        res.render('account/newAuction', {
            isPermitted: result,
            isSucceeded: false,
            layoutModels: res.locals.layoutModels
        });
    });
});

accountRoute.post('/newAuction', upload.array('hinhanh', 12), function(req, res) {
    console.log(req.body.giamuangay);
    var entity = {
        tensp: req.body.ten,
        loaisp: req.body.loaisp,
        tgbatdau: moment(req.body.tgbatdau, 'DD-MM-YYYY HH:mm').format('YYYY-MM-DD HH:mm'),
        tgketthuc: moment(req.body.tgketthuc, 'DD-MM-YYYY HH:mm').format('YYYY-MM-DD HH:mm'),
        giakhoidiem: req.body.giakhoidiem,
        buocgia: req.body.buocgia,
        giamuangay: req.body.giamuangay == "" ? 'null' : req.body.giamuangay,
        nguoiban: res.locals.layoutModels.account.id,
        mota: req.body.motangangon,
        thongtin: req.body.motachitiet,
        cogiahan: req.body.tudonggiahan
    };
    console.log(entity);
    product.newProduct(entity).then(function(rowid) {
        console.log(rowid);
        console.log('upload successfullly');
        mv(srcdir, './public/Imgs/sp/' + rowid, { mkdirp: true }, function(err) {
            console.log('move successfully');
        });
        res.render('account/newAuction', {
            isPermitted: true,
            isSucceeded: true,
            layoutModels: res.locals.layoutModels
        });
    });


});

accountRoute.get('/editAuction', restrict, function(req, res) {
    console.log("editAuction");
    product.loadProductbyId(req.query.id).then(function(row) {
        if (row.manguoiban != res.locals.layoutModels.account.id) {
            res.render('account/editAuction', {
                layoutModels: res.locals.layoutModels,
                isPermitted: false, 
                isSucceeded: false
            });
        } else {
            res.render('account/editAuction', {
                layoutModels: res.locals.layoutModels,
                isPermitted: true, 
                isSucceeded: false,
                row: row
            });
        }
    });
});

accountRoute.post('/editAuction/:id', restrict, function(req, res) {
    console.log(req.params.id);
    console.log(req.body.tudonggiahan);
    var now = moment().format('D/M/YYYY - HH:mm');
    var entity = {
        thongtin: "<p>Cập nhật " + now + ":</p><hr>" + req.body.motachitiet,
        id: req.body.madaugia
    };
    console.log(entity);
    product.updateProduct(entity).then(function(rowid){
        res.render('account/editAuction', {
                layoutModels: res.locals.layoutModels,
                isPermitted: true, 
                isSucceeded: true
        });
    });

});

accountRoute.get('/', restrict, function(req, res) {

    res.render('account/profile', {
        layoutModels: res.locals.layoutModels
    });
});

accountRoute.get('/ratedetail', restrict, function(req, res) {
    account.getRateDetail(res.locals.layoutModels.account.id).then(function(data) {
        //console.log(data)
        var nrate = 0
        if (data.total === 0) {

        } else {
            nrate = res.locals.layoutModels.account.positivepoint / (res.locals.layoutModels.account.positivepoint + res.locals.layoutModels.account.negativepoint) * 100;
            nrate = nrate.toFixed(2);
        }
        console.log(data.list);
        console.log(nrate);
        res.render('account/ratedetail', {
            list: data.list,
            isEmpty: data.total === 0,
            rate: nrate,
            layoutModels: res.locals.layoutModels
        });
    });
});

accountRoute.get('/bidingList', restrict, function(req, res) {
    account.getBidingList(res.locals.layoutModels.account.id).then(function(rows) {
        res.render('account/bidingList', {
            list: rows,
            isEmpty: rows.length === 0,
            layoutModels: res.locals.layoutModels
        });
    });
});

accountRoute.get('/wonList', restrict, function(req, res) {
    account.getWonList(res.locals.layoutModels.account.id).then(function(rows) {
        res.render('account/wonList', {
            list: rows,
            isEmpty: rows.length === 0,
            layoutModels: res.locals.layoutModels
        });
    });
});

accountRoute.get('/sellingList', restrict, function(req, res) {
    account.getSellingList(res.locals.layoutModels.account.id).then(function(rows) {
        //console.log(rows.length);
        res.render('account/sellingList', {
            list: rows,
            isEmpty: rows.length === 0,
            layoutModels: res.locals.layoutModels
        });
    });
});

accountRoute.get('/soldList', restrict, function(req, res) {
    account.getSoldList(res.locals.layoutModels.account.id).then(function(rows) {

        res.render('account/soldList', {
            list: rows,
            isEmpty: rows.length === 0,
            layoutModels: res.locals.layoutModels
        });
    });
});

accountRoute.get('/newPermit', restrict, function(req, res) {
    res.render('account/newPermit', {
        layoutModels: res.locals.layoutModels,
        showError: false,
        errorMsg: ''
    });
});

accountRoute.post('/newPermit', restrict, function(req, res) {

    account.insertNewPer(res.locals.layoutModels.account.id).then(function(insertId) {
        console.log(insertId);
        res.redirect('/account/profile');
    });

});

accountRoute.get('/rateSeller', restrict, function(req, res) {
    console.log(req.query.id);
    res.render('account/rateSeller', {
        layoutModels: res.locals.layoutModels,
        showError: false,
        errorMsg: ''
    });
});

accountRoute.post('/rateSeller', restrict, function(req, res) {
    console.log(req.query.idPro);
    console.log(req.body.nx);
    console.log(req.body.diem);
    console.log(req.query.idAcc)
    var entity = {
        nx: req.body.nx,
        diem: req.body.diem,
        idPro: req.query.idPro,
        idSeller: req.query.idAcc,
        idBuyer: res.locals.layoutModels.account.id
    };
    account.daDanhGiaNguoiBan(entity).then(function(result) {
        if (result) {
            res.render('account/rateSeller', {
                layoutModels: res.locals.layoutModels,
                showError: true,
                errorMsg: 'Bạn không thể đánh giá cho sản phẩm này (đã đánh giá trước đây)!'
            });
        } else {
            account.updateDanhGiaNguoiBan(entity).then(function(changedRows) {
                res.render('account/rateSeller', {
                    layoutModels: res.locals.layoutModels,
                    showError: true,
                    errorMsg: 'Đánh giá thành công!'
                });
            });
        }
    });
});

accountRoute.get('/rateBuyer', restrict, function(req, res) {

    res.render('account/rateBuyer', {
        layoutModels: res.locals.layoutModels,
        showError: false,
        errorMsg: ''
    });
});

accountRoute.post('/rateBuyer', restrict, function(req, res) {

    var entity = {
        nx: req.body.nx,
        diem: req.body.diem,
        idPro: req.query.idPro,
        idSeller: res.locals.layoutModels.account.id,
        idBuyer: req.query.idAcc
    };
    account.daDanhGiaNguoiMua(entity).then(function(result) {
        if (result) {
            res.render('account/rateBuyer', {
                layoutModels: res.locals.layoutModels,
                showError: true,
                errorMsg: 'Bạn không thể đánh giá cho sản phẩm này (đã đánh giá trước đây)!'
            });
        } else {
            account.updateDanhGiaNguoiMua(entity).then(function(changedRows) {
                res.render('account/rateSeller', {
                    layoutModels: res.locals.layoutModels,
                    showError: true,
                    errorMsg: 'Đánh giá thành công!'
                });
            });
        }
    });
});

module.exports = accountRoute;
