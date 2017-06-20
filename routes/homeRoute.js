var express = require('express');

var homeRoute = express.Router();

homeRoute.get('/', function(req, res) {
    res.render('home/index', {
        layoutModels: res.locals.layoutModels
    });
});

module.exports = homeRoute;