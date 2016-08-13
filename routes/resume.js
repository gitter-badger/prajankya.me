var express = require('express');
var router = express.Router();
var debug = require('debug')('resume');
var path = require('path');
var fs = require('fs');

router.get('/', function(req, res, next) {
    global.resume.getResume("html", function(stream) {
        stream.pipe(res);
    });
});

router.get('/update', function(req, res, next) {
    var folder = path.join(path.join(path.join(__dirname, "../"), "data"), "out");
    emptyDir(folder);
    global.resume.getResume("json", function(stream) {
        stream.pipe(res);
    })
});

router.get('/ld', function(req, res, next) {
    res.json(global.resume.getJSON_LD());
});

router.get('/:type', function(req, res, next) {
    var ar = ['html', 'json', 'doc', 'txt', 'yml', 'md'];
    if (ar.indexOf(req.params.type) > -1) {
        global.resume.getResume(req.params.type, function(stream) {
            stream.pipe(res);
        });
    } else {
        res.sendStatus(501);
        res.end('Not Implemented this File format yet');
    }
});

global.resume.getJSON_LD = function() {
    return {
        "@context": "http://www.schema.org",
        "@type": "person",
        "name": global.resume.get("name").value(),
        "jobTitle": global.resume.get("employment").get("history").get(0).get("position").value(),
        "url": global.resume.get("contact").get("website").value(),
        "address": {
            "@type": "PostalAddress",
            "streetAddress": global.resume.get("location").get("address").value(),
            "addressLocality": global.resume.get("location").get("city").value(),
            "addressRegion": global.resume.get("location").get("region").value(),
            "postalCode": global.resume.get("location").get("code").value(),
            "addressCountry": global.resume.get("location").get("country").value()
        },
        "email": global.resume.get("contact").get("email").value(),
        "telephone": global.resume.get("contact").get("phone").value()
    };
};

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
        'data/out/res.all',
        '--theme',
        'modern'
    ];
    var hac = path.join(path.join(path.join(path.join(__dirname, "../"), "node_modules"), ".bin"), "hackmyresume");
    var cmd = require('child_process').spawn(hac, opts)
        .on('close', function(closeCode) {
            if (closeCode == 0) {
                callback();
            } else {
                console.error("hackmyresume run error, closed with code :" + closeCode);
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
                emptyDir(filePath);
            }
        }
    }
};

module.exports = router;
