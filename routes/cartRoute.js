var express = require('express');
var moment = require('moment');

var product = require('../models/product');
var cart = require('../models/cart');
var order = require('../models/order');
var detail = require('../models/order-detail');
var restrict = require('../middle-wares/restrict');

var cartRoute = express.Router();

cartRoute.get('/', restrict, function(req, res) {
    res.render('cart/index', {
        layoutModels: res.locals.layoutModels,
        items: req.session.cart,
        total: cart.getTotal(req.session.cart),
        isEmpty: req.session.cart.length === 0
    });
});

cartRoute.post('/add', restrict, function(req, res) {
    product.loadDetail(req.body.proId).then(function(pro) {
        var item = {
            product: {
                ProID: pro.ProID,
                ProName: pro.ProName,
                Price: pro.Price,
            },
            quantity: +req.body.quantity,
            amount: pro.Price * +req.body.quantity
        };
        cart.add(req.session.cart, item);
        res.redirect('/product/detail/' + req.body.proId);
    });
});

cartRoute.post('/add1', restrict, function(req, res) {
    product.loadDetail(req.body.proId).then(function(pro) {
        var item = {
            product: {
                ProID: pro.ProID,
                ProName: pro.ProName,
                Price: pro.Price,
            },
            quantity: 1,
            amount: pro.Price
        };
        cart.add(req.session.cart, item);
        res.redirect('/product/byCat/' + req.body.catId);
    });
});

cartRoute.post('/remove', restrict, function(req, res) {
    var proId = +req.body.proId;
    cart.remove(req.session.cart, proId);
    res.redirect('/cart');
});

cartRoute.post('/update', restrict, function(req, res) {
    var proId = +req.body.proId;
    var quantity = +req.body.quantity;
    cart.update(req.session.cart, proId, quantity);
    res.redirect('/cart');
});

cartRoute.post('/checkout', restrict, function(req, res) {
    var entity = {
        OrderDate: moment().format('YYYY-MM-DDTHH:mm'),
        UserID: req.session.user.id,
        Total: req.body.total
    };

    order.insert(entity)
        .then(function(orderId) {
            detail.insertAll(req.session.cart, orderId)
                .then(function(idList) {
                	req.session.cart = [];
                    res.redirect('/cart');
                });
        });
});

module.exports = cartRoute;