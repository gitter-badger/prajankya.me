var express = require('express');
var app = express();
var server = require('http').createServer(app);
var bodyParser = require('body-parser');
var path = require('path');
var favicon = require('serve-favicon');
var low = require("lowdb");

/* -------------------------------- CONFIG -------------------------------*/

var name = 'My CV'; // For debug
var settings = {
    photoFile: "prajankya.jpg", //then you can use http://website.url/photo for getting photo
    github_username: "prajankya" //If not given, any part of github will not be shown
};

/* ----------------------------- END OF CONFIG ---------------------------*/

global.settings = settings;

var debug = require('debug')('http');

debug('booting %s', name);

global.resumeDB = low('data/resume.json');
resumeDB.defaults({})
    .value();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(bodyParser.json({
    limit: '50mb'
}));

app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: false
}));

app.use(express.static(path.join(__dirname, 'public')));

var index = require('./routes/index');
app.use('/', index);

var resumes = require('./routes/resume');
app.use('/resume', resumes);

// catch 404 and forward to error handler
/*
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
*/

app.set('port', process.env.PORT || 3000);
this.port = process.env.PORT || 3000;

server.listen(app.get('port'), function() {
    console.log("Started on port :" + app.get('port'));
    debug("Express server listening on port " + app.get('port'));
});
