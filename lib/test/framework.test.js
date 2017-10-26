"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var sinon = require("sinon");
var supertest = require("supertest");
var chai_1 = require("chai");
var express = require("express");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var inversify_1 = require("inversify");
var server_1 = require("../src/server");
var decorators_1 = require("../src/decorators");
var constants_1 = require("../src/constants");
var Bluebird = require("bluebird");
describe("Integration Tests:", function () {
    var server;
    var container;
    beforeEach(function (done) {
        // refresh container and container
        container = new inversify_1.Container();
        done();
    });
    describe("Routing & Request Handling:", function () {
        it("should work for async controller methods", function (done) {
            var TestController = /** @class */ (function () {
                function TestController() {
                }
                TestController.prototype.getTest = function (req, res) {
                    return new Promise((function (resolve) {
                        setTimeout(resolve, 100, "GET");
                    }));
                };
                __decorate([
                    decorators_1.httpGet("/"),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", [Object, Object]),
                    __metadata("design:returntype", void 0)
                ], TestController.prototype, "getTest", null);
                TestController = __decorate([
                    inversify_1.injectable(),
                    decorators_1.controller("/")
                ], TestController);
                return TestController;
            }());
            container.bind(constants_1.TYPE.Controller).to(TestController).whenTargetNamed("TestController");
            server = new server_1.InversifyExpressServer(container);
            supertest(server.build())
                .get("/")
                .expect(200, "GET", done);
        });
        it("should work for async controller methods that fails", function (done) {
            var TestController = /** @class */ (function () {
                function TestController() {
                }
                TestController.prototype.getTest = function (req, res) {
                    return new Promise((function (resolve, reject) {
                        setTimeout(reject, 100, "GET");
                    }));
                };
                __decorate([
                    decorators_1.httpGet("/"),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", [Object, Object]),
                    __metadata("design:returntype", void 0)
                ], TestController.prototype, "getTest", null);
                TestController = __decorate([
                    inversify_1.injectable(),
                    decorators_1.controller("/")
                ], TestController);
                return TestController;
            }());
            container.bind(constants_1.TYPE.Controller).to(TestController).whenTargetNamed("TestController");
            server = new server_1.InversifyExpressServer(container);
            supertest(server.build())
                .get("/")
                .expect(500, done);
        });
        it("should work for async controller methods using non-native Bluebird promise", function (done) {
            var TestController = /** @class */ (function () {
                function TestController() {
                }
                TestController.prototype.getTest = function (req, res) {
                    return new Bluebird((function (resolve) {
                        setTimeout(resolve, 100, "GET");
                    }));
                };
                __decorate([
                    decorators_1.httpGet("/"),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", [Object, Object]),
                    __metadata("design:returntype", void 0)
                ], TestController.prototype, "getTest", null);
                TestController = __decorate([
                    inversify_1.injectable(),
                    decorators_1.controller("/")
                ], TestController);
                return TestController;
            }());
            container.bind(constants_1.TYPE.Controller).to(TestController).whenTargetNamed("TestController");
            server = new server_1.InversifyExpressServer(container);
            supertest(server.build())
                .get("/")
                .expect(200, "GET", done);
        });
        it("should work for async controller methods, using non-native Bluebird promise, that fails", function (done) {
            var TestController = /** @class */ (function () {
                function TestController() {
                }
                TestController.prototype.getTest = function (req, res) {
                    return new Bluebird((function (resolve, reject) {
                        setTimeout(reject, 100, "GET");
                    }));
                };
                __decorate([
                    decorators_1.httpGet("/"),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", [Object, Object]),
                    __metadata("design:returntype", void 0)
                ], TestController.prototype, "getTest", null);
                TestController = __decorate([
                    inversify_1.injectable(),
                    decorators_1.controller("/")
                ], TestController);
                return TestController;
            }());
            container.bind(constants_1.TYPE.Controller).to(TestController).whenTargetNamed("TestController");
            server = new server_1.InversifyExpressServer(container);
            supertest(server.build())
                .get("/")
                .expect(500, done);
        });
        it("should work for methods which call nextFunc()", function (done) {
            var TestController = /** @class */ (function () {
                function TestController() {
                }
                TestController.prototype.getTest = function (req, res, nextFunc) {
                    nextFunc();
                };
                TestController.prototype.getTest2 = function (req, res) {
                    return "GET";
                };
                __decorate([
                    decorators_1.httpGet("/"),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", [Object, Object, Function]),
                    __metadata("design:returntype", void 0)
                ], TestController.prototype, "getTest", null);
                __decorate([
                    decorators_1.httpGet("/"),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", [Object, Object]),
                    __metadata("design:returntype", void 0)
                ], TestController.prototype, "getTest2", null);
                TestController = __decorate([
                    inversify_1.injectable(),
                    decorators_1.controller("/")
                ], TestController);
                return TestController;
            }());
            container.bind(constants_1.TYPE.Controller).to(TestController).whenTargetNamed("TestController");
            server = new server_1.InversifyExpressServer(container);
            supertest(server.build())
                .get("/")
                .expect(200, "GET", done);
        });
        it("should work for async methods which call nextFunc()", function (done) {
            var TestController = /** @class */ (function () {
                function TestController() {
                }
                TestController.prototype.getTest = function (req, res, nextFunc) {
                    return new Promise((function (resolve) {
                        setTimeout(function () {
                            nextFunc();
                            resolve();
                        }, 100, "GET");
                    }));
                };
                TestController.prototype.getTest2 = function (req, res) {
                    return "GET";
                };
                __decorate([
                    decorators_1.httpGet("/"),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", [Object, Object, Function]),
                    __metadata("design:returntype", void 0)
                ], TestController.prototype, "getTest", null);
                __decorate([
                    decorators_1.httpGet("/"),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", [Object, Object]),
                    __metadata("design:returntype", void 0)
                ], TestController.prototype, "getTest2", null);
                TestController = __decorate([
                    inversify_1.injectable(),
                    decorators_1.controller("/")
                ], TestController);
                return TestController;
            }());
            container.bind(constants_1.TYPE.Controller).to(TestController).whenTargetNamed("TestController");
            server = new server_1.InversifyExpressServer(container);
            supertest(server.build())
                .get("/")
                .expect(200, "GET", done);
        });
        it("should work for async methods called by nextFunc()", function (done) {
            var TestController = /** @class */ (function () {
                function TestController() {
                }
                TestController.prototype.getTest = function (req, res, nextFunc) {
                    nextFunc();
                };
                TestController.prototype.getTest2 = function (req, res) {
                    return new Promise((function (resolve) {
                        setTimeout(resolve, 100, "GET");
                    }));
                };
                __decorate([
                    decorators_1.httpGet("/"),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", [Object, Object, Function]),
                    __metadata("design:returntype", void 0)
                ], TestController.prototype, "getTest", null);
                __decorate([
                    decorators_1.httpGet("/"),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", [Object, Object]),
                    __metadata("design:returntype", void 0)
                ], TestController.prototype, "getTest2", null);
                TestController = __decorate([
                    inversify_1.injectable(),
                    decorators_1.controller("/")
                ], TestController);
                return TestController;
            }());
            container.bind(constants_1.TYPE.Controller).to(TestController).whenTargetNamed("TestController");
            server = new server_1.InversifyExpressServer(container);
            supertest(server.build())
                .get("/")
                .expect(200, "GET", done);
        });
        it("should work for each shortcut decorator", function (done) {
            var TestController = /** @class */ (function () {
                function TestController() {
                }
                TestController.prototype.getTest = function (req, res) { res.send("GET"); };
                TestController.prototype.postTest = function (req, res) { res.send("POST"); };
                TestController.prototype.putTest = function (req, res) { res.send("PUT"); };
                TestController.prototype.patchTest = function (req, res) { res.send("PATCH"); };
                TestController.prototype.headTest = function (req, res) { res.send("HEAD"); };
                TestController.prototype.deleteTest = function (req, res) { res.send("DELETE"); };
                __decorate([
                    decorators_1.httpGet("/"),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", [Object, Object]),
                    __metadata("design:returntype", void 0)
                ], TestController.prototype, "getTest", null);
                __decorate([
                    decorators_1.httpPost("/"),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", [Object, Object]),
                    __metadata("design:returntype", void 0)
                ], TestController.prototype, "postTest", null);
                __decorate([
                    decorators_1.httpPut("/"),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", [Object, Object]),
                    __metadata("design:returntype", void 0)
                ], TestController.prototype, "putTest", null);
                __decorate([
                    decorators_1.httpPatch("/"),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", [Object, Object]),
                    __metadata("design:returntype", void 0)
                ], TestController.prototype, "patchTest", null);
                __decorate([
                    decorators_1.httpHead("/"),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", [Object, Object]),
                    __metadata("design:returntype", void 0)
                ], TestController.prototype, "headTest", null);
                __decorate([
                    decorators_1.httpDelete("/"),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", [Object, Object]),
                    __metadata("design:returntype", void 0)
                ], TestController.prototype, "deleteTest", null);
                TestController = __decorate([
                    inversify_1.injectable(),
                    decorators_1.controller("/")
                ], TestController);
                return TestController;
            }());
            container.bind(constants_1.TYPE.Controller).to(TestController).whenTargetNamed("TestController");
            server = new server_1.InversifyExpressServer(container);
            var agent = supertest(server.build());
            var deleteFn = function () { agent.delete("/").expect(200, "DELETE", done); };
            var head = function () { agent.head("/").expect(200, "HEAD", deleteFn); };
            var patch = function () { agent.patch("/").expect(200, "PATCH", head); };
            var put = function () { agent.put("/").expect(200, "PUT", patch); };
            var post = function () { agent.post("/").expect(200, "POST", put); };
            var get = function () { agent.get("/").expect(200, "GET", post); };
            get();
        });
        it("should work for more obscure HTTP methods using the httpMethod decorator", function (done) {
            var TestController = /** @class */ (function () {
                function TestController() {
                }
                TestController.prototype.getTest = function (req, res) { res.send("PROPFIND"); };
                __decorate([
                    decorators_1.httpMethod("propfind", "/"),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", [Object, Object]),
                    __metadata("design:returntype", void 0)
                ], TestController.prototype, "getTest", null);
                TestController = __decorate([
                    inversify_1.injectable(),
                    decorators_1.controller("/")
                ], TestController);
                return TestController;
            }());
            container.bind(constants_1.TYPE.Controller).to(TestController).whenTargetNamed("TestController");
            server = new server_1.InversifyExpressServer(container);
            supertest(server.build())
                .propfind("/")
                .expect(200, "PROPFIND", done);
        });
        it("should use returned values as response", function (done) {
            var result = { "hello": "world" };
            var TestController = /** @class */ (function () {
                function TestController() {
                }
                TestController.prototype.getTest = function (req, res) { return result; };
                __decorate([
                    decorators_1.httpGet("/"),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", [Object, Object]),
                    __metadata("design:returntype", void 0)
                ], TestController.prototype, "getTest", null);
                TestController = __decorate([
                    inversify_1.injectable(),
                    decorators_1.controller("/")
                ], TestController);
                return TestController;
            }());
            container.bind(constants_1.TYPE.Controller).to(TestController).whenTargetNamed("TestController");
            server = new server_1.InversifyExpressServer(container);
            supertest(server.build())
                .get("/")
                .expect(200, JSON.stringify(result), done);
        });
        it("should use custom router passed from configuration", function () {
            var TestController = /** @class */ (function () {
                function TestController() {
                }
                TestController.prototype.get = function () {
                    return "Such Text";
                };
                __decorate([
                    decorators_1.httpGet("/Endpoint"),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", []),
                    __metadata("design:returntype", void 0)
                ], TestController.prototype, "get", null);
                TestController = __decorate([
                    inversify_1.injectable(),
                    decorators_1.controller("/CaseSensitive")
                ], TestController);
                return TestController;
            }());
            container.bind(constants_1.TYPE.Controller).to(TestController).whenTargetNamed("TestController");
            var customRouter = express.Router({
                caseSensitive: true
            });
            server = new server_1.InversifyExpressServer(container, customRouter);
            var app = server.build();
            var expectedSuccess = supertest(app)
                .get("/CaseSensitive/Endpoint")
                .expect(200, "Such Text");
            var expectedNotFound1 = supertest(app)
                .get("/casesensitive/endpoint")
                .expect(404);
            var expectedNotFound2 = supertest(app)
                .get("/CaseSensitive/endpoint")
                .expect(404);
            return Promise.all([
                expectedSuccess,
                expectedNotFound1,
                expectedNotFound2
            ]);
        });
        it("should use custom routing configuration", function () {
            var TestController = /** @class */ (function () {
                function TestController() {
                }
                TestController.prototype.get = function () {
                    return "pong";
                };
                __decorate([
                    decorators_1.httpGet("/endpoint"),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", []),
                    __metadata("design:returntype", void 0)
                ], TestController.prototype, "get", null);
                TestController = __decorate([
                    inversify_1.injectable(),
                    decorators_1.controller("/ping")
                ], TestController);
                return TestController;
            }());
            container.bind(constants_1.TYPE.Controller).to(TestController).whenTargetNamed("TestController");
            server = new server_1.InversifyExpressServer(container, null, { rootPath: "/api/v1" });
            return supertest(server.build())
                .get("/api/v1/ping/endpoint")
                .expect(200, "pong");
        });
    });
    describe("Middleware:", function () {
        var result;
        var middleware = {
            a: function (req, res, nextFunc) {
                result += "a";
                nextFunc();
            },
            b: function (req, res, nextFunc) {
                result += "b";
                nextFunc();
            },
            c: function (req, res, nextFunc) {
                result += "c";
                nextFunc();
            }
        };
        var spyA = sinon.spy(middleware, "a");
        var spyB = sinon.spy(middleware, "b");
        var spyC = sinon.spy(middleware, "c");
        beforeEach(function (done) {
            result = "";
            spyA.reset();
            spyB.reset();
            spyC.reset();
            done();
        });
        it("should call method-level middleware correctly (GET)", function (done) {
            var TestController = /** @class */ (function () {
                function TestController() {
                }
                TestController.prototype.getTest = function (req, res) { res.send("GET"); };
                __decorate([
                    decorators_1.httpGet("/", spyA, spyB, spyC),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", [Object, Object]),
                    __metadata("design:returntype", void 0)
                ], TestController.prototype, "getTest", null);
                TestController = __decorate([
                    inversify_1.injectable(),
                    decorators_1.controller("/")
                ], TestController);
                return TestController;
            }());
            container.bind(constants_1.TYPE.Controller).to(TestController).whenTargetNamed("TestController");
            server = new server_1.InversifyExpressServer(container);
            var agent = supertest(server.build());
            agent.get("/")
                .expect(200, "GET", function () {
                chai_1.expect(spyA.calledOnce).to.eqls(true);
                chai_1.expect(spyB.calledOnce).to.eqls(true);
                chai_1.expect(spyC.calledOnce).to.eqls(true);
                chai_1.expect(result).to.equal("abc");
                done();
            });
        });
        it("should call method-level middleware correctly (POST)", function (done) {
            var TestController = /** @class */ (function () {
                function TestController() {
                }
                TestController.prototype.postTest = function (req, res) { res.send("POST"); };
                __decorate([
                    decorators_1.httpPost("/", spyA, spyB, spyC),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", [Object, Object]),
                    __metadata("design:returntype", void 0)
                ], TestController.prototype, "postTest", null);
                TestController = __decorate([
                    inversify_1.injectable(),
                    decorators_1.controller("/")
                ], TestController);
                return TestController;
            }());
            container.bind(constants_1.TYPE.Controller).to(TestController).whenTargetNamed("TestController");
            server = new server_1.InversifyExpressServer(container);
            var agent = supertest(server.build());
            agent.post("/")
                .expect(200, "POST", function () {
                chai_1.expect(spyA.calledOnce).to.eqls(true);
                chai_1.expect(spyB.calledOnce).to.eqls(true);
                chai_1.expect(spyC.calledOnce).to.eqls(true);
                chai_1.expect(result).to.equal("abc");
                done();
            });
        });
        it("should call method-level middleware correctly (PUT)", function (done) {
            var TestController = /** @class */ (function () {
                function TestController() {
                }
                TestController.prototype.postTest = function (req, res) { res.send("PUT"); };
                __decorate([
                    decorators_1.httpPut("/", spyA, spyB, spyC),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", [Object, Object]),
                    __metadata("design:returntype", void 0)
                ], TestController.prototype, "postTest", null);
                TestController = __decorate([
                    inversify_1.injectable(),
                    decorators_1.controller("/")
                ], TestController);
                return TestController;
            }());
            container.bind(constants_1.TYPE.Controller).to(TestController).whenTargetNamed("TestController");
            server = new server_1.InversifyExpressServer(container);
            var agent = supertest(server.build());
            agent.put("/")
                .expect(200, "PUT", function () {
                chai_1.expect(spyA.calledOnce).to.eqls(true);
                chai_1.expect(spyB.calledOnce).to.eqls(true);
                chai_1.expect(spyC.calledOnce).to.eqls(true);
                chai_1.expect(result).to.equal("abc");
                done();
            });
        });
        it("should call method-level middleware correctly (PATCH)", function (done) {
            var TestController = /** @class */ (function () {
                function TestController() {
                }
                TestController.prototype.postTest = function (req, res) { res.send("PATCH"); };
                __decorate([
                    decorators_1.httpPatch("/", spyA, spyB, spyC),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", [Object, Object]),
                    __metadata("design:returntype", void 0)
                ], TestController.prototype, "postTest", null);
                TestController = __decorate([
                    inversify_1.injectable(),
                    decorators_1.controller("/")
                ], TestController);
                return TestController;
            }());
            container.bind(constants_1.TYPE.Controller).to(TestController).whenTargetNamed("TestController");
            server = new server_1.InversifyExpressServer(container);
            var agent = supertest(server.build());
            agent.patch("/")
                .expect(200, "PATCH", function () {
                chai_1.expect(spyA.calledOnce).to.eqls(true);
                chai_1.expect(spyB.calledOnce).to.eqls(true);
                chai_1.expect(spyC.calledOnce).to.eqls(true);
                chai_1.expect(result).to.equal("abc");
                done();
            });
        });
        it("should call method-level middleware correctly (HEAD)", function (done) {
            var TestController = /** @class */ (function () {
                function TestController() {
                }
                TestController.prototype.postTest = function (req, res) { res.send("HEAD"); };
                __decorate([
                    decorators_1.httpHead("/", spyA, spyB, spyC),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", [Object, Object]),
                    __metadata("design:returntype", void 0)
                ], TestController.prototype, "postTest", null);
                TestController = __decorate([
                    inversify_1.injectable(),
                    decorators_1.controller("/")
                ], TestController);
                return TestController;
            }());
            container.bind(constants_1.TYPE.Controller).to(TestController).whenTargetNamed("TestController");
            server = new server_1.InversifyExpressServer(container);
            var agent = supertest(server.build());
            agent.head("/")
                .expect(200, "HEAD", function () {
                chai_1.expect(spyA.calledOnce).to.eqls(true);
                chai_1.expect(spyB.calledOnce).to.eqls(true);
                chai_1.expect(spyC.calledOnce).to.eqls(true);
                chai_1.expect(result).to.equal("abc");
                done();
            });
        });
        it("should call method-level middleware correctly (DELETE)", function (done) {
            var TestController = /** @class */ (function () {
                function TestController() {
                }
                TestController.prototype.postTest = function (req, res) { res.send("DELETE"); };
                __decorate([
                    decorators_1.httpDelete("/", spyA, spyB, spyC),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", [Object, Object]),
                    __metadata("design:returntype", void 0)
                ], TestController.prototype, "postTest", null);
                TestController = __decorate([
                    inversify_1.injectable(),
                    decorators_1.controller("/")
                ], TestController);
                return TestController;
            }());
            container.bind(constants_1.TYPE.Controller).to(TestController).whenTargetNamed("TestController");
            server = new server_1.InversifyExpressServer(container);
            var agent = supertest(server.build());
            agent.delete("/")
                .expect(200, "DELETE", function () {
                chai_1.expect(spyA.calledOnce).to.eqls(true);
                chai_1.expect(spyB.calledOnce).to.eqls(true);
                chai_1.expect(spyC.calledOnce).to.eqls(true);
                chai_1.expect(result).to.equal("abc");
                done();
            });
        });
        it("should call method-level middleware correctly (ALL)", function (done) {
            var TestController = /** @class */ (function () {
                function TestController() {
                }
                TestController.prototype.postTest = function (req, res) { res.send("ALL"); };
                __decorate([
                    decorators_1.all("/", spyA, spyB, spyC),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", [Object, Object]),
                    __metadata("design:returntype", void 0)
                ], TestController.prototype, "postTest", null);
                TestController = __decorate([
                    inversify_1.injectable(),
                    decorators_1.controller("/")
                ], TestController);
                return TestController;
            }());
            container.bind(constants_1.TYPE.Controller).to(TestController).whenTargetNamed("TestController");
            server = new server_1.InversifyExpressServer(container);
            var agent = supertest(server.build());
            agent.get("/")
                .expect(200, "ALL", function () {
                chai_1.expect(spyA.calledOnce).to.eqls(true);
                chai_1.expect(spyB.calledOnce).to.eqls(true);
                chai_1.expect(spyC.calledOnce).to.eqls(true);
                chai_1.expect(result).to.equal("abc");
                done();
            });
        });
        it("should call controller-level middleware correctly", function (done) {
            var TestController = /** @class */ (function () {
                function TestController() {
                }
                TestController.prototype.getTest = function (req, res) { res.send("GET"); };
                __decorate([
                    decorators_1.httpGet("/"),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", [Object, Object]),
                    __metadata("design:returntype", void 0)
                ], TestController.prototype, "getTest", null);
                TestController = __decorate([
                    inversify_1.injectable(),
                    decorators_1.controller("/", spyA, spyB, spyC)
                ], TestController);
                return TestController;
            }());
            container.bind(constants_1.TYPE.Controller).to(TestController).whenTargetNamed("TestController");
            server = new server_1.InversifyExpressServer(container);
            supertest(server.build())
                .get("/")
                .expect(200, "GET", function () {
                chai_1.expect(spyA.calledOnce).to.eqls(true);
                chai_1.expect(spyB.calledOnce).to.eqls(true);
                chai_1.expect(spyC.calledOnce).to.eqls(true);
                chai_1.expect(result).to.equal("abc");
                done();
            });
        });
        it("should call server-level middleware correctly", function (done) {
            var TestController = /** @class */ (function () {
                function TestController() {
                }
                TestController.prototype.getTest = function (req, res) { res.send("GET"); };
                __decorate([
                    decorators_1.httpGet("/"),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", [Object, Object]),
                    __metadata("design:returntype", void 0)
                ], TestController.prototype, "getTest", null);
                TestController = __decorate([
                    inversify_1.injectable(),
                    decorators_1.controller("/")
                ], TestController);
                return TestController;
            }());
            container.bind(constants_1.TYPE.Controller).to(TestController).whenTargetNamed("TestController");
            server = new server_1.InversifyExpressServer(container);
            server.setConfig(function (app) {
                app.use(spyA);
                app.use(spyB);
                app.use(spyC);
            });
            supertest(server.build())
                .get("/")
                .expect(200, "GET", function () {
                chai_1.expect(spyA.calledOnce).to.eqls(true);
                chai_1.expect(spyB.calledOnce).to.eqls(true);
                chai_1.expect(spyC.calledOnce).to.eqls(true);
                chai_1.expect(result).to.equal("abc");
                done();
            });
        });
        it("should call all middleware in correct order", function (done) {
            var TestController = /** @class */ (function () {
                function TestController() {
                }
                TestController.prototype.getTest = function (req, res) { res.send("GET"); };
                __decorate([
                    decorators_1.httpGet("/", spyC),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", [Object, Object]),
                    __metadata("design:returntype", void 0)
                ], TestController.prototype, "getTest", null);
                TestController = __decorate([
                    inversify_1.injectable(),
                    decorators_1.controller("/", spyB)
                ], TestController);
                return TestController;
            }());
            container.bind(constants_1.TYPE.Controller).to(TestController).whenTargetNamed("TestController");
            server = new server_1.InversifyExpressServer(container);
            server.setConfig(function (app) {
                app.use(spyA);
            });
            supertest(server.build())
                .get("/")
                .expect(200, "GET", function () {
                chai_1.expect(spyA.calledOnce).to.eqls(true);
                chai_1.expect(spyB.calledOnce).to.eqls(true);
                chai_1.expect(spyC.calledOnce).to.eqls(true);
                chai_1.expect(result).to.equal("abc");
                done();
            });
        });
        it("should resolve controller-level middleware", function () {
            var symbolId = Symbol("spyA");
            var strId = "spyB";
            var TestController = /** @class */ (function () {
                function TestController() {
                }
                TestController.prototype.getTest = function (req, res) { res.send("GET"); };
                __decorate([
                    decorators_1.httpGet("/"),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", [Object, Object]),
                    __metadata("design:returntype", void 0)
                ], TestController.prototype, "getTest", null);
                TestController = __decorate([
                    inversify_1.injectable(),
                    decorators_1.controller("/", symbolId, strId)
                ], TestController);
                return TestController;
            }());
            container.bind(constants_1.TYPE.Controller).to(TestController).whenTargetNamed("TestController");
            container.bind(symbolId).toConstantValue(spyA);
            container.bind(strId).toConstantValue(spyB);
            server = new server_1.InversifyExpressServer(container);
            var agent = supertest(server.build());
            return agent.get("/")
                .expect(200, "GET")
                .then(function () {
                chai_1.expect(spyA.calledOnce).to.eqls(true);
                chai_1.expect(spyB.calledOnce).to.eqls(true);
                chai_1.expect(result).to.equal("ab");
            });
        });
        it("should resolve method-level middleware", function () {
            var symbolId = Symbol("spyA");
            var strId = "spyB";
            var TestController = /** @class */ (function () {
                function TestController() {
                }
                TestController.prototype.getTest = function (req, res) { res.send("GET"); };
                __decorate([
                    decorators_1.httpGet("/", symbolId, strId),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", [Object, Object]),
                    __metadata("design:returntype", void 0)
                ], TestController.prototype, "getTest", null);
                TestController = __decorate([
                    inversify_1.injectable(),
                    decorators_1.controller("/")
                ], TestController);
                return TestController;
            }());
            container.bind(constants_1.TYPE.Controller).to(TestController).whenTargetNamed("TestController");
            container.bind(symbolId).toConstantValue(spyA);
            container.bind(strId).toConstantValue(spyB);
            server = new server_1.InversifyExpressServer(container);
            var agent = supertest(server.build());
            return agent.get("/")
                .expect(200, "GET")
                .then(function () {
                chai_1.expect(spyA.calledOnce).to.eqls(true);
                chai_1.expect(spyB.calledOnce).to.eqls(true);
                chai_1.expect(result).to.equal("ab");
            });
        });
        it("should compose controller- and method-level middleware", function () {
            var symbolId = Symbol("spyA");
            var strId = "spyB";
            var TestController = /** @class */ (function () {
                function TestController() {
                }
                TestController.prototype.getTest = function (req, res) { res.send("GET"); };
                __decorate([
                    decorators_1.httpGet("/", strId),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", [Object, Object]),
                    __metadata("design:returntype", void 0)
                ], TestController.prototype, "getTest", null);
                TestController = __decorate([
                    inversify_1.injectable(),
                    decorators_1.controller("/", symbolId)
                ], TestController);
                return TestController;
            }());
            container.bind(constants_1.TYPE.Controller).to(TestController).whenTargetNamed("TestController");
            container.bind(symbolId).toConstantValue(spyA);
            container.bind(strId).toConstantValue(spyB);
            server = new server_1.InversifyExpressServer(container);
            var agent = supertest(server.build());
            return agent.get("/")
                .expect(200, "GET")
                .then(function () {
                chai_1.expect(spyA.calledOnce).to.eqls(true);
                chai_1.expect(spyB.calledOnce).to.eqls(true);
                chai_1.expect(result).to.equal("ab");
            });
        });
    });
    describe("Parameters:", function () {
        it("should bind a method parameter to the url parameter of the web request", function (done) {
            var TestController = /** @class */ (function () {
                function TestController() {
                }
                // tslint:disable-next-line:max-line-length
                TestController.prototype.getTest = function (id, req, res) {
                    return id;
                };
                __decorate([
                    decorators_1.httpGet(":id"), __param(0, decorators_1.requestParam("id")),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", [String, Object, Object]),
                    __metadata("design:returntype", void 0)
                ], TestController.prototype, "getTest", null);
                TestController = __decorate([
                    inversify_1.injectable(),
                    decorators_1.controller("/")
                ], TestController);
                return TestController;
            }());
            container.bind(constants_1.TYPE.Controller).to(TestController).whenTargetNamed("TestController");
            server = new server_1.InversifyExpressServer(container);
            supertest(server.build())
                .get("/foo")
                .expect(200, "foo", done);
        });
        it("should bind a method parameter to the request object", function (done) {
            var TestController = /** @class */ (function () {
                function TestController() {
                }
                TestController.prototype.getTest = function (req) {
                    return req.params.id;
                };
                __decorate([
                    decorators_1.httpGet(":id"), __param(0, decorators_1.request()),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", [Object]),
                    __metadata("design:returntype", void 0)
                ], TestController.prototype, "getTest", null);
                TestController = __decorate([
                    inversify_1.injectable(),
                    decorators_1.controller("/")
                ], TestController);
                return TestController;
            }());
            container.bind(constants_1.TYPE.Controller).to(TestController).whenTargetNamed("TestController");
            server = new server_1.InversifyExpressServer(container);
            supertest(server.build())
                .get("/GET")
                .expect(200, "GET", done);
        });
        it("should bind a method parameter to the response object", function (done) {
            var TestController = /** @class */ (function () {
                function TestController() {
                }
                TestController.prototype.getTest = function (res) {
                    return res.send("foo");
                };
                __decorate([
                    decorators_1.httpGet("/"), __param(0, decorators_1.response()),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", [Object]),
                    __metadata("design:returntype", void 0)
                ], TestController.prototype, "getTest", null);
                TestController = __decorate([
                    inversify_1.injectable(),
                    decorators_1.controller("/")
                ], TestController);
                return TestController;
            }());
            container.bind(constants_1.TYPE.Controller).to(TestController).whenTargetNamed("TestController");
            server = new server_1.InversifyExpressServer(container);
            supertest(server.build())
                .get("/")
                .expect(200, "foo", done);
        });
        it("should bind a method parameter to a query parameter", function (done) {
            var TestController = /** @class */ (function () {
                function TestController() {
                }
                TestController.prototype.getTest = function (id) {
                    return id;
                };
                __decorate([
                    decorators_1.httpGet("/"), __param(0, decorators_1.queryParam("id")),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", [String]),
                    __metadata("design:returntype", void 0)
                ], TestController.prototype, "getTest", null);
                TestController = __decorate([
                    inversify_1.injectable(),
                    decorators_1.controller("/")
                ], TestController);
                return TestController;
            }());
            container.bind(constants_1.TYPE.Controller).to(TestController).whenTargetNamed("TestController");
            server = new server_1.InversifyExpressServer(container);
            supertest(server.build())
                .get("/")
                .query("id=foo")
                .expect(200, "foo", done);
        });
        it("should bind a method parameter to the request body", function (done) {
            var TestController = /** @class */ (function () {
                function TestController() {
                }
                TestController.prototype.getTest = function (reqBody) {
                    return reqBody;
                };
                __decorate([
                    decorators_1.httpPost("/"), __param(0, decorators_1.requestBody()),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", [String]),
                    __metadata("design:returntype", void 0)
                ], TestController.prototype, "getTest", null);
                TestController = __decorate([
                    inversify_1.injectable(),
                    decorators_1.controller("/")
                ], TestController);
                return TestController;
            }());
            container.bind(constants_1.TYPE.Controller).to(TestController).whenTargetNamed("TestController");
            server = new server_1.InversifyExpressServer(container);
            var body = { foo: "bar" };
            server.setConfig(function (app) {
                app.use(bodyParser.json());
            });
            supertest(server.build())
                .post("/")
                .send(body)
                .expect(200, body, done);
        });
        it("should bind a method parameter to the request headers", function (done) {
            var TestController = /** @class */ (function () {
                function TestController() {
                }
                TestController.prototype.getTest = function (headers) {
                    return headers;
                };
                __decorate([
                    decorators_1.httpGet("/"), __param(0, decorators_1.requestHeaders("testhead")),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", [Object]),
                    __metadata("design:returntype", void 0)
                ], TestController.prototype, "getTest", null);
                TestController = __decorate([
                    inversify_1.injectable(),
                    decorators_1.controller("/")
                ], TestController);
                return TestController;
            }());
            container.bind(constants_1.TYPE.Controller).to(TestController).whenTargetNamed("TestController");
            server = new server_1.InversifyExpressServer(container);
            supertest(server.build())
                .get("/")
                .set("TestHead", "foo")
                .expect(200, "foo", done);
        });
        it("should bind a method parameter to a cookie", function (done) {
            var TestController = /** @class */ (function () {
                function TestController() {
                }
                TestController.prototype.getCookie = function (cookie, req, res) {
                    if (cookie) {
                        res.send(cookie);
                    }
                    else {
                        res.send(":(");
                    }
                };
                __decorate([
                    decorators_1.httpGet("/"), __param(0, decorators_1.cookies("cookie")),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", [Object, Object, Object]),
                    __metadata("design:returntype", void 0)
                ], TestController.prototype, "getCookie", null);
                TestController = __decorate([
                    inversify_1.injectable(),
                    decorators_1.controller("/")
                ], TestController);
                return TestController;
            }());
            container.bind(constants_1.TYPE.Controller).to(TestController).whenTargetNamed("TestController");
            server = new server_1.InversifyExpressServer(container);
            server.setConfig(function (app) {
                app.use(cookieParser());
                app.use(function (req, res, nextFunc) {
                    res.cookie("cookie", "hey");
                    nextFunc();
                });
            });
            supertest(server.build())
                .get("/")
                .expect("set-cookie", "cookie=hey; Path=/", done);
        });
        it("should bind a method parameter to the next function", function (done) {
            var TestController = /** @class */ (function () {
                function TestController() {
                }
                TestController.prototype.getTest = function (nextFunc) {
                    var err = new Error("foo");
                    return nextFunc();
                };
                TestController.prototype.getResult = function () {
                    return "foo";
                };
                __decorate([
                    decorators_1.httpGet("/"), __param(0, decorators_1.next()),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", [Object]),
                    __metadata("design:returntype", void 0)
                ], TestController.prototype, "getTest", null);
                __decorate([
                    decorators_1.httpGet("/"),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", []),
                    __metadata("design:returntype", void 0)
                ], TestController.prototype, "getResult", null);
                TestController = __decorate([
                    inversify_1.injectable(),
                    decorators_1.controller("/")
                ], TestController);
                return TestController;
            }());
            container.bind(constants_1.TYPE.Controller).to(TestController).whenTargetNamed("TestController");
            server = new server_1.InversifyExpressServer(container);
            supertest(server.build())
                .get("/")
                .expect(200, "foo", done);
        });
    });
});
