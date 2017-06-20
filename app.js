var path = require('path');
// var http = require('http');

var express = require('express');
var session = require('express-session');
// var fileStore = require('session-file-store')(session);
var MySQLStore = require('express-mysql-session')(session);

var exphbs = require('express-handlebars');
var exphbs_sections = require('express-handlebars-sections');

var favicon = require('serve-favicon');
var bodyParser = require('body-parser');

var morgan = require('morgan');
var mustache = require('mustache');
var moment = require('moment');
var wnumb = require('wnumb');

var layoutRoute = require('./routes/_layoutRoute');
var homeRoute = require('./routes/homeRoute');
var productRoute = require('./routes/productRoute');
var accountRoute = require('./routes/accountRoute');
var cartRoute = require('./routes/cartRoute');

var app = express();

//
// logger

app.use(morgan('short'));

//
// view engine

app.engine('hbs', exphbs({
    extname: 'hbs',
    defaultLayout: 'main',
    layoutsDir: 'views/_layouts/',
    partialsDir: 'views/_partials/',
    helpers: {
        section: exphbs_sections(),
        now: function() {
            return moment().format('D/M/YYYY - HH:mm');
        },
        formatNumber: function(n) {
            var nf = wnumb({
                thousand: ','
            });
            return nf.to(n);
        },
    }
}));
app.set('view engine', 'hbs');

//
// static files & favicon

app.use(express.static(
    path.resolve(__dirname, 'public')
));

app.use(favicon(
    path.join(__dirname, 'public', 'favicon.ico')
));

//
// body-parser

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: false
}));

//
// session

app.use(session({
    secret: 'Z7X7gXzoKBT8h18jwXBEP4T0kJ8=',
    resave: false,
    saveUninitialized: true,
    // store: new fileStore()
    store: new MySQLStore({
        host: '127.0.0.1',
        port: 3306,
        user: 'root',
        password: '',
        database: 'qlbh',
        createDatabaseTable: true,
        schema: {
            tableName: 'sessions',
            columnNames: {
                session_id: 'session_id',
                expires: 'expires',
                data: 'data'
            }
        }
    }),
}));

//
// routes

app.use(layoutRoute);
app.use('/home', homeRoute);
app.use('/product', productRoute);
app.use('/account', accountRoute);
app.use('/cart', cartRoute);

app.get('/', function(req, res) {
    res.end('Welcome to my homepage!');
});

app.get('/about', function(req, res) {
    res.end('Welcome to the about page!');
});

app.get('/hello/:who', function(req, res) {
    // var who = req.params.who;
    // var view = {
    //  value: who
    // }
    // var str = mustache.render('Hello, {{value}}', view);

    var str = mustache.render('Hello, {{who}}', req.params);
    res.end(str);
});

app.get('/hello', function(req, res) {
    var name = req.query.name;
    var str = 'hello, ' + name;
    res.end(str);
});

app.use(function(req, res) {
    res.statusCode = 404;
    res.end('404!');
});

//
// start http-server

app.listen(3000);

// var server = app.listen(3000, function() {
//     var host = server.address().address;
//     var port = server.address().port;
//     console.log('Example app listening at http://%s:%s', host, port);
// });