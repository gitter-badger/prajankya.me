var express = require('express');
var router = express.Router();
var colors = require('colors/safe');

/* GET home page. */
router.get('/', function(req, res, next) {
    var ua = req.headers["user-agent"];
    if (/(curl)/gi.test(ua)) {
        res.end(colors.red.underline("Welcome To Prajankya's Personal Server"));
    } else {
        res.render('index', {
            title: ''
        });
    }
});


module.exports = router;
