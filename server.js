var express = require('express');
var app = express();
var server = require('http').createServer(app);
var bodyParser = require('body-parser');
var path = require('path');
var favicon = require('serve-favicon');
var low = require("lowdb");
var exphbs = require('express-handlebars');

/* -------------------------------- CONFIG -------------------------------*/

global.settings = {
    photoFile: "prajankya.png", //then you can use http://website.url/photo for getting photo
    github_username: "prajankya", //If not given, any part of github will not be shown
    website: "prajankya.me", //The Website where this is going to get hosted(currently only used in github user agent)
    google_analytics_id: "UA-69733143-5"
};

/* ----------------------------- END OF CONFIG ---------------------------*/

global.ga_script = "<script>" +
    "(function(i, s, o, g, r, a, m) {" +
    "i['GoogleAnalyticsObject'] = r;" +
    "i[r] = i[r] || function() {" +
    "(i[r].q = i[r].q || []).push(arguments)" +
    "}, i[r].l = 1 * new Date();" +
    "a = s.createElement(o)," +
    "m = s.getElementsByTagName(o)[0];" +
    "a.async = 1;" +
    "a.src = g;" +
    "m.parentNode.insertBefore(a, m)" +
    "})(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');" +
    "ga('create', '" + global.settings.google_analytics_id + "', 'auto');" +
    "ga('require', 'linkid');" +
    "</script>";

var debug = require('debug')('myServer');

debug('booting %s', 'My CV');

global.resumeDB = low('data/resume.json');
resumeDB.defaults({})
    .value();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//app.engine('ejs', engines.ejs);
//app.engine('html', require('ejs').renderFile);
//app.engine('handlebars', engines.handlebars);


app.use(bodyParser.json({
    limit: '50mb'
}));

app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: false
}));

var resumes = require('./routes/resume');
app.use('/resume', resumes);

var posts = require('./routes/posts');
app.use('/posts', posts);

var hbs = exphbs.create({ /* config */ });
app.engine('handlebars', hbs.engine);

app.use("/post", function(req, res, next) {
    app.set('view engine', 'handlebars');
    next();
});


if (global.settings.github_username) {
    var github = require('./routes/github');
    app.use('/api/github', github);
}

app.use(express.static(path.join(__dirname, 'public')));
var index = require('./routes/index');
app.use('/', index);
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
