var express = require('express');
var router = express.Router();
var colors = require('colors/safe');
var path = require('path');
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
    var ua = req.headers["user-agent"];
    if (/(curl)/gi.test(ua)) {
        res.end(colors.red.underline("Welcome To Prajankya's Personal Server"));
    } else {
        res.render('index', {
            title: global.resumeDB.get("name").value(),
            ld: JSON.stringify(global.resume.getJSON_LD())
        });
    }
});

router.get('/photo', function(req, res, next) {
    var filepath = path.join(path.join(path.join(__dirname, ".."), "public"), global.photoFile);
    res.sendFile(filepath);
});
router.get('/photo/:size', function(req, res, next) {
    var filepath = path.join(path.join(path.join(__dirname, ".."), "public"), req.params.size + "_" + global.photoFile);
    try {
        fs.accessSync(filepath);
        res.sendFile(filepath);
    } catch (e) {
        res.sendStatus(404);
    }
});

module.exports = router;
