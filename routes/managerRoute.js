var express = require('express');
var category = require('../models/category');
var product = require('../models/product');
var account = require('../models/account.js');
var crypto = require('crypto');
var restrict = require('../middle-wares/restrict');
var moment = require('moment');

var r = express.Router();

r.get('/category', restrict, function(req, res) {
    if (req.session.account.permission !== 4) {
        res.redirect('/403');
    } else {
        res.render('manager/category/index', {
            layoutModels: res.locals.layoutModels,
            error: req.session.error
        });
        delete req.session.error;
    }

});

r.get('/category/add', restrict, function(req, res) {
    if (req.session.account.permission !== 4) {
        res.redirect('/403');
    } else {
        res.render('manager/category/add', {
            layoutModels: res.locals.layoutModels,
            showError: false,
            errorMsg: ''
        });
    }
});

r.post('/category/add', restrict, function(req, res) {
    if (req.session.account.permission !== 4) {
        res.redirect('/403');
    } else {
        var entity = {
            catName: req.body.catName
        };
        category.insert(entity).then(function(data) {
            res.render('manager/category/add', {
                layoutModels: res.locals.layoutModels,
                showError: true,
                errorMsg: 'Thêm danh mục thành công'
            });
        }).catch(function(err) {
            console.log(err);
            res.end('insert fail');
        });
    }
});

r.get('/category/edit', restrict, function(req, res) {
    if (req.session.account.permission !== 4) {
        res.redirect('/403');
    } else {
        var id = req.query.id;
        category.loadDetail(id).then(function(cat) {
            res.render('manager/category/edit', {
                layoutModels: res.locals.layoutModels,
                showError: false,
                errorMsg: '',
                category: cat
            });
        });
    }
});

r.post('/category/edit', restrict, function(req, res) {
    if (req.session.account.permission !== 4) {
        res.redirect('/403');
    } else {
        var entity = {
            catId: req.body.catId,
            catName: req.body.catName
        }
        category.update(entity).then(function(changedRows) {
            res.redirect('/manager/category');
        })
    }
});

r.post('/category/delete', restrict, function(req, res) {
    if (req.session.account.permission !== 4) {
        res.redirect('/403');
    } else {
        var entity = {
            id: req.body.catId
        };

        product.loadAllByCat(req.body.catId).then(function(rows) {
            if (rows.length > 0) {
                req.session.error = 'Không thể xóa danh mục có sản phẩm';
                res.redirect('/manager/category');
            } else {
                category.delete(entity).then(function(affectedRows) {
                    res.redirect('/manager/category');
                });
            }
        });

    }
});

r.get('/account', restrict, function(req, res) {
    if (req.session.account.permission !== 4) {
        res.redirect('/403');
    } else {
        account.loadAll().then(function(rows) {
            res.render('manager/account/index', {
                layoutModels: res.locals.layoutModels,
                accounts: rows
            });
        });
    }

});

r.post('/account/delete', restrict, function(req, res) {
    if (req.session.account.permission !== 4) {
        res.redirect('/403');
    } else {
        var entity = {
            id: req.body.accId
        };
        console.log(entity);
        account.delete(entity).then(function(affectedRows) {
            res.redirect('/manager/account');
        });
    }
});

r.post('/account/reset', restrict, function(req, res) {
    if (req.session.account.permission !== 4) {
        res.redirect('/403');
    } else {
        var ePWD = crypto.createHash('md5').update('00000000').digest('hex');
        var entity = {
            id: req.body.accId,
            pass: ePWD
        };
        console.log(entity);
        account.reset(entity).then(function(affectedRows) {
            res.redirect('/manager/account');
        });
    }
});

r.get('/account/approval', restrict, function(req, res) {
    if (req.session.account.permission !== 4) {
        res.redirect('/403');
    } else {
        account.loadApproval().then(function(rows) {
            for (i = 0; i < rows.length; i++) {
                rows[i].thoigianxin = moment(rows[i].thoigianxin).format('YYYY-MM-DD HH:mm:ss')
            }
            res.render('manager/account/approval', {
                layoutModels: res.locals.layoutModels,
                listAppro: rows
            });
        });
    }

});

r.post('/account/approval', restrict, function(req, res) {
    if (req.session.account.permission !== 4) {
        res.redirect('/403');
    } else {
        var id = req.body.id;
        for (i = 0; i < id.length; i++) {
            account.updateApproval(id[i]);
        }
        res.redirect('/manager/account/approval');
    }
});

module.exports = r;
