var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.sendStatus(404);
});
router.get('/:post_name', function(req, res, next) {
    var file = path.join(path.join(path.join(path.join(__dirname, ".."), "views"), "posts"), req.params.post_name);
    res.render(file + ".handlebars");
});

module.exports = router;
