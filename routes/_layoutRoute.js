var Q = require('q');
var category = require('../models/category');
var cart = require('../models/cart');

module.exports = function(req, res, next) {
    // category.loadAll().then(function(data) {
    //     // res.locals.categories = data;
    //     res.locals.layoutModels = {
    //     	categories: data
    //     };
    //     next();
    // });

    if (req.session.isLogged === undefined) {
        req.session.isLogged = false;
    }

    Q.all([
        category.loadAll()
    ]).spread(function(catList) {
        res.locals.layoutModels = {
            categories: catList,
            isLogged: req.session.isLogged,
            curUser: req.session.user,
            cartSumQ: cart.sumQ(req.session.cart)
        };

        next();
    });
};