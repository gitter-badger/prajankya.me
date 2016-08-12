var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.json(global.resume.getResume());
});

global.resume.getResume = function() {
    return (global.resume.value());
};

module.exports = router;
