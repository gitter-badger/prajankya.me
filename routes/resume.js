var express = require('express');
var router = express.Router();
var debug = require('debug')('resume');
var path = require('path');
var fs = require('fs');

router.get('/', function(req, res, next) {
    global.resume.getResume("json", function(stream) {
        stream.pipe(res);
    });
});

router.get('/all', function(req, res, next) {
    var folder = path.join(path.join(path.join(__dirname, "../"), "data"), "out");
    emptyDir(folder);
    global.resume.getResume("json", function(stream) {
        stream.pipe(res);
    })
});

router.get('/md', function(req, res, next) {
    global.resume.getResume("md", function(stream) {
        stream.pipe(res);
    })
});

global.resume.getResume = function(type, callback) {
    var file = path.join(path.join(path.join(path.join(__dirname, "../"), "data"), "out"), "res." + type);
    fs.access(file, fs.F_OK, function(err) {
        if (!err) {
            callback(fs.createReadStream(file));
        } else {
            global.resume.hackmyresume(function() {
                callback(fs.createReadStream(file));
            });
        }
    });
};

global.resume.hackmyresume = function(callback) {
    var opts = [
        'BUILD',
        path.join(path.join(path.join(__dirname, "../"), "data"), "resume.json"),
        'TO',
        'data/out/res.all'
    ];
    var hac = path.join(path.join(path.join(path.join(__dirname, "../"), "node_modules"), ".bin"), "hackmyresume");
    var cmd = require('child_process').spawn(hac, opts)
        .on('close', function(closeCode) {
            if (closeCode == 0) {
                callback();
            } else {
                console.error("hackmyresume run error, closed with code :" + code);
            }
        })
        .on('error', function(err) {
            console.error(err);
        });
}

var emptyDir = function(dirPath) {
    try {
        var files = fs.readdirSync(dirPath);
    } catch (e) {
        return;
    }
    if (files.length > 0) {
        for (var i = 0; i < files.length; i++) {
            var filePath = path.join(dirPath, files[i]);
            if (fs.statSync(filePath).isFile()) {
                fs.unlinkSync(filePath);
            } else {
                rmDir(filePath);
            }
        }
    }
};

module.exports = router;
