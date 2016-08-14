var express = require('express');
var router = express.Router();
var debug = require('debug')('resume');
var path = require('path');
var fs = require('fs');
var low = require("lowdb");

global.resume = {};

router.get('/', function(req, res, next) {
    global.resume.getResume("html", function(stream) {
        stream.pipe(res);
    });
});

router.get('/update', function(req, res, next) {
    var folder = path.join(path.join(path.join(__dirname, "../"), "data"), "out");
    emptyDir(folder);
    try {
        fs.unlinkSync(path.join(path.join(path.join(__dirname, "../"), "data"), "github.json"));
    } catch (e) {
        debug(e);
    }
    global.resume.getResume("html", function(stream) {
        stream.pipe(res);
    })
});

router.get('/ld', function(req, res, next) {
    res.json(global.resume.getJSON_LD());
});

router.get('/:type', function(req, res, next) {
    var ar = ['html', 'json', 'yml', 'md', 'txt', 'doc', 'pdf'];
    var mime = ['text/html', 'application/json', 'text/yaml', 'text/markdown', 'text/plain', 'application/msword', 'application/pdf'];
    var ind = ar.indexOf(req.params.type);
    if (ind > -1) {
        global.resume.getResume(req.params.type, function(stream) {
            res.writeHead(200, {
                'Content-Type': mime[ind] + "; charset=utf-8"
            });
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
        "name": global.resumeDB.get("name").value(),
        "jobTitle": global.resumeDB.get("employment").get("history").get(0).get("position").value(),
        "url": global.resumeDB.get("contact").get("website").value(),
        "address": {
            "@type": "PostalAddress",
            "streetAddress": global.resumeDB.get("location").get("address").value(),
            "addressLocality": global.resumeDB.get("location").get("city").value(),
            "addressRegion": global.resumeDB.get("location").get("region").value(),
            "postalCode": global.resumeDB.get("location").get("code").value(),
            "addressCountry": global.resumeDB.get("location").get("country").value()
        },
        "image": global.resumeDB.get("info").get("image").value(),
        "email": global.resumeDB.get("contact").get("email").value(),
        "telephone": global.resumeDB.get("contact").get("phone").value()
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
    generateCombined(function() {
        var opts = [
            'BUILD',
            path.join(path.join(path.join(__dirname, "../"), "data"), "resume_combined.json"),
            'TO',
            'data/out/res.all',
            '--theme',
            "modern",
            "--pdf",
            "wkhtmltopdf"
        ];

        var hac = path.join(path.join(path.join(path.join(__dirname, "../"), "node_modules"), ".bin"), "hackmyresume");
        var cmd = require('child_process').spawn(hac, opts)
            .on('close', function(closeCode) {
                if (closeCode == 0) {
                    var opts = [
                        'BUILD',
                        path.join(path.join(path.join(__dirname, "../"), "data"), "resume_combined.json"),
                        'TO',
                        'data/out/res.html',
                        '--theme',
                        path.join(path.join(path.join(__dirname, "../"), "data"), "fresh-theme-elegant")
                    ];
                    var cmd2 = require('child_process').spawn(hac, opts)
                        .on('close', function(closeCode2) {
                            if (closeCode2 == 0) {
                                callback();
                            } else {
                                console.error("hackmyresume run error, closed with code :" + closeCode2);
                            }
                        });
                    c_log(cmd2);
                } else {
                    console.error("hackmyresume run error, closed with code :" + closeCode);
                }
            })
            .on('error', function(err) {
                console.error(err);
            });
        c_log(cmd);
    });
}

function c_log(child) {
    child.stdout.on('data', function(data) {
        console.log(data.toString());
    });

    child.stderr.on('data', function(data) {
        console.error(data.toString());
    });
}

var generateCombined = function(cb) {
    var folder = path.join(path.join(__dirname, "../"), "data");
    var resume = fs.readFileSync(path.join(folder, "resume.json"));
    fs.writeFileSync(path.join(folder, "resume_combined.json"), resume);

    if (global.settings.github_username) {
        global.github.get(function(stream) {
            var github_projects = '';
            stream.on('data', function(chunk) {
                github_projects += chunk;
            });
            stream.on('end', function() {
                var combined = low(path.join(folder, "resume_combined.json"));
                github_projects = JSON.parse(github_projects);
                var projects = combined
                    .get("projects");

                github_projects.forEach(function(item) {
                    var project = projects
                        .find({
                            "title": item.name
                        });

                    item.title = item.name;
                    item.name = undefined;

                    item.repo = item.html_url;
                    item.html_url = undefined;

                    item.summary = item.description;
                    item.description = undefined;

                    if (item.language) {
                        if (project.get("keywords").value()) {
                            project.get("keywords").push(item.language);
                        } else {
                            item.keywords = [];
                            item.keywords.push(item.language);
                        }
                    }

                    if (!project.get("url").value()) {
                        item.url = item.repo;
                    }

                    if (!project.get("start").value()) {
                        item.start = item.created_at;
                    }

                    if (project.value()) {
                        for (var key in item) {
                            if (item.hasOwnProperty(key)) {
                                project.set(key, item[key]).value();
                            }
                        }
                    } else {
                        projects.unshift(item).value();
                    }
                });
                cb();
            });
        });
    } else {
        cb();
    }
};

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

module.exports = router;;
