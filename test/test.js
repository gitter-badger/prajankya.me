var server = require('../server.js');
var expect = require("chai").expect;
var request = require("request");
var base_url = "http://localhost:" + server.port;

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

    describe("Checking resume", function() {
        describe("/resume API", function() {
            /*it("with curl", function(done) {
                request({
                    url: base_url + "/resume",
                    headers: {
                        'User-Agent': 'curl'
                    }
                }, function(error, response, body) {
                    console.log(body.length);
                    console.log(error);
                    //console.log(response);
                    expect(response.statusCode).to.be.equal(200);
                    done();
                });
            });*/
            it("with browser", function(done) {
                request(base_url + "/resume", function(error, response, body) {
                    expect(response.statusCode).to.equal(200);
                    done();
                });
            });
        });
        describe("/resume/json API", function() {
            it("with curl", function(done) {
                request({
                    url: base_url + "/resume/json",
                    headers: {
                        'User-Agent': 'curl'
                    }
                }, function(error, response, body) {
                    expect(response.statusCode).to.equal(200);
                    expect(JSON.parse(body)).to.be.an("object");
                    done();
                });
            });
            it("with browser", function(done) {
                request(base_url + "/resume/json", function(error, response, body) {
                    expect(response.statusCode).to.equal(200);
                    expect(JSON.parse(body)).to.be.an("object");
                    done();
                });
            });
        });
        describe("/resume/doc API", function() {
            it("with curl", function(done) {
                request({
                    url: base_url + "/resume/doc",
                    headers: {
                        'User-Agent': 'curl'
                    }
                }, function(error, response, body) {
                    expect(response.statusCode).to.equal(200);
                    done();
                });
            });
            it("with browser", function(done) {
                request(base_url + "/resume/doc", function(error, response, body) {
                    expect(response.statusCode).to.equal(200);
                    done();
                });
            });
        });
        describe("/resume/html API", function() {
            it("with curl", function(done) {
                request({
                    url: base_url + "/resume/html",
                    headers: {
                        'User-Agent': 'curl'
                    }
                }, function(error, response, body) {
                    expect(response.statusCode).to.equal(200);
                    done();
                });
            });
            it("with browser", function(done) {
                request(base_url + "/resume/html", function(error, response, body) {
                    expect(response.statusCode).to.equal(200);
                    done();
                });
            });
        });
        describe("/resume/txt API", function() {
            it("with curl", function(done) {
                request({
                    url: base_url + "/resume/txt",
                    headers: {
                        'User-Agent': 'curl'
                    }
                }, function(error, response, body) {
                    expect(response.statusCode).to.equal(200);
                    done();
                });
            });
            it("with browser", function(done) {
                request(base_url + "/resume/txt", function(error, response, body) {
                    expect(response.statusCode).to.equal(200);
                    done();
                });
            });
        });
        describe("/resume/yml API", function() {
            it("with curl", function(done) {
                request({
                    url: base_url + "/resume/yml",
                    headers: {
                        'User-Agent': 'curl'
                    }
                }, function(error, response, body) {
                    expect(response.statusCode).to.equal(200);
                    done();
                });
            });
            it("with browser", function(done) {
                request(base_url + "/resume/yml", function(error, response, body) {
                    expect(response.statusCode).to.equal(200);
                    done();
                });
            });
        });
        describe("/resume/md API", function() {
            it("with curl", function(done) {
                request({
                    url: base_url + "/resume/md",
                    headers: {
                        'User-Agent': 'curl'
                    }
                }, function(error, response, body) {
                    expect(response.statusCode).to.equal(200);
                    done();
                });
            });
            it("with browser", function(done) {
                request(base_url + "/resume/md", function(error, response, body) {
                    expect(response.statusCode).to.equal(200);
                    done();
                });
            });
        });
        describe("/resume/something_not_possible API", function() {
            it("with curl", function(done) {
                request({
                    url: base_url + "/resume/something_not_possible",
                    headers: {
                        'User-Agent': 'curl'
                    }
                }, function(error, response, body) {
                    expect(response.statusCode).to.equal(501);
                    done();
                });
            });
            it("with browser", function(done) {
                request(base_url + "/resume/something_not_possible", function(error, response, body) {
                    expect(response.statusCode).to.equal(501);
                    done();
                });
            });
        });
    });
});
