var server = require('../server.js');
var expect = require("chai").expect;
var request = require("request");
var base_url = "http://127.0.0.1:" + server.port;

describe("Main API Server", function() {
    it("Check that its testing server", function(done) {
        expect(server.port).to.be.equals(3000);
        done();
    });
});

describe("Curl Server", function() {
    it("Checking / with curl", function(done) {
        request({
            url: base_url,
            headers: {
                'User-Agent': 'curl'
            }
        }, function(error, response, body) {
            expect(response.statusCode).to.equal(200);
            console.log(body);
            done();
        });
    });
});
