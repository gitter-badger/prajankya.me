var express = require('express');
var router = express.Router();
var debug = require('debug')('github');
var path = require('path');
var fs = require('fs');
var request = require("request");

global.github = {};

router.get('/', function(req, res, next) {
    global.github.get(function(stream) {
        stream.pipe(res);
    });
});
global.github.get = function(callback) {
    if (!global.github.file) {
        global.github.file = path.join(path.join(path.join(__dirname, "../"), "data"), "github.json");
    }

    fs.access(global.github.file, fs.F_OK, function(err) {
        if (!err) {
            callback(fs.createReadStream(global.github.file));
        } else {
            global.github.update(function() {
                callback(fs.createReadStream(global.github.file));
            });
        }
    });
};
global.github.update = function(callback) {
    //No need to delete the file for update as its getting overwritten
    request({
        url: "http://api.github.com/users/" + global.settings.github_username + "/repos",
        headers: {
            'User-Agent': global.settings.website,
            'Accept': 'application/vnd.github.v3+json'
        }
    }, function(error, response, body) {
        if (error) {
            console.error(error);
        }
        var out = [];
        var input = JSON.parse('{"ar":' + body + "}").ar;
        input.forEach(function(item) {
            var obj = {};
            obj.id = item.id;
            obj.name = item.name;
            obj.html_url = item.html_url;
            obj.description = item.description;
            obj.created_at = item.created_at;
            obj.updated_at = item.updated_at;
            obj.pushed_at = item.pushed_at;
            obj.clone_url = item.clone_url;
            obj.size = item.size;
            obj.stargazers_count = item.stargazers_count;
            obj.watchers_count = item.watchers_count;
            obj.language = item.language;
            obj.forks_count = item.forks_count;
            obj.watchers = item.watchers;

            out.push(obj);
        });
        fs.writeFile(global.github.file, JSON.stringify(out), function(err) {
            if (err) {
                return console.err(err);
            }
            callback();
        });
    });
};

module.exports = router;
