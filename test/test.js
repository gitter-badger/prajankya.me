var server = require('../server.js');
var expect = require("chai").expect;
var request = require("request");

describe("Main API Server", function() {
    it("Check that its testing server", function(done) {
        expect(server.port).to.be.equals(3000);
        done();
    });
});
