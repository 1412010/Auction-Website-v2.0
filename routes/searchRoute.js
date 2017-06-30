var express = require('express');
var product = require('../models/product');
var account = require('../models/account');

var searchRoute = express.Router();

searchRoute.get('', function(req, res) {

    console.log(req.query.word);
    console.log(req.query.cat);
    console.log(req.query.order);
    var orderBy = 'tensp asc';
    var orderString = "Từ A đên Z"
    switch (req.query.order) {
        case "1":
            orderBy = 'tgketthuc asc';
            orderString = "Thời gian kết thúc tăng dần";
            break;
        case "2":
            orderBy = 'tgketthuc desc';
            orderString = "Thời gian kết thúc giảm dần";
            break;
        case "3":
            orderBy = 'giahientai asc';
            orderString = "Giá hiện tại tăng dần";
            break;
        case "4":
            orderBy = 'giahientai desc';
            orderString = "Giá hiện tại giảm dần";
            break;

    }

    console.log(orderBy);
    var rec_per_page = 4;
    var curPage = req.query.page ? req.query.page : 1;
    var offset = (curPage - 1) * rec_per_page;

    product.searchProduct(req.query.word, req.query.cat, orderBy, rec_per_page, offset).then(function(data) {
        var number_of_pages = data.total / rec_per_page;
        if (data.total % rec_per_page > 0) {
            number_of_pages++;
        }

        var pages = [];
        for (var i = 1; i <= number_of_pages; i++) {
            pages.push({
                pageValue: i,
                isActive: i === +curPage
            });
        }


        res.render('search/result', {
            layoutModels: res.locals.layoutModels,
            word: req.query.word,
            isEmpty: data.rows.length === 0,
            total: data.total,
            rows: data.rows,
            orderString: orderString,

            pages: pages,
            curPage: curPage,
            prevPage: curPage - 1,
            nextPage: parseInt(curPage) + 1,
            showPrevPage: curPage > 1,
            showNextPage: curPage < number_of_pages - 1
        });
    });
});

searchRoute.get('', function(req, res) {
	if (req.session.isLogged === true) {
        product.insertTheoDoi(req.session.account.id, req.params.id)
        .then(function() {
            res.redirect('/search');
        });

    } else {
        res.render('account/login', {
            layoutModels: res.locals.layoutModels,
            showError: false,
            errorMsg: ''
        });
    }
});

module.exports = searchRoute;
