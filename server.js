var express = require('express');
var app = express();
var server = require('http').createServer(app);
//var logger = require('morgan');
var bodyParser = require('body-parser');
var path = require('path');
var favicon = require('serve-favicon');
var low = require("lowdb");
var colors = require('colors/safe');

var name = 'My CV';
var debug = require('debug')('http');

debug('booting %s', name);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

//app.use(logger('dev'));

app.use(bodyParser.json({
    limit: '50mb'
}));

app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: false
}));

app.use(function(req, res, next) {
    var ua = req.headers["user-agent"];
    if (/(curl)/gi.test(ua)) {
        console.log(colors.red.underline('i like cake and pies'));
        res.end(colors.red.underline("\u00A7e Welcome To Prajankya's Personal Server"));
    } else {
        app.use(express.static(path.join(__dirname, 'public')));

        var routes = require('./routes/index');
        app.use('/', routes);
    }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
app.set('port', process.env.PORT || 3000);
this.port = process.env.PORT || 3000;

server.listen(app.get('port'), function() {
    console.log("Started on port :" + app.get('port'));
    debug("Express server listening on port " + app.get('port'));
});
