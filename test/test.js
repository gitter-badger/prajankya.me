var server = require('../server.js');
var resume = require('../routes/resume.js');
var expect = require("chai").expect;
var request = require("request");
var base_url = "http://127.0.0.1:" + server.port;

describe("Main API Server", function() {
    it("Check that its testing server", function(done) {
        expect(server.port).to.be.equals(3000);
        done();
    });
    it("Checking / with curl", function(done) {
        request({
            url: base_url,
            headers: {
                'User-Agent': 'curl'
            }
        }, function(error, response, body) {
            expect(response.statusCode).to.equal(200);
            done();
        });
    });

    describe("Checking /resume JSON", function() {
        it("Checking the function of getResume()", function(done) {
            expect(global.resume.getResume()).to.be.json;
            done();
        });
        it("Checking if the function is available at /resume , with curl", function(done) {
            request({
                url: base_url + "/resume",
                headers: {
                    'User-Agent': 'curl'
                }
            }, function(error, response, body) {
                expect(response.statusCode).to.equal(200);
                done();
            });
        });
        it("Checking if the function is available at /resume , with browser", function(done) {
            request(base_url + "/resume", function(error, response, body) {
                expect(response.statusCode).to.equal(200);
                done();
            });
        });
    });
});
