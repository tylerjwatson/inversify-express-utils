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
var chai_1 = require("chai");
var express = require("express");
var server_1 = require("../src/server");
var inversify_1 = require("inversify");
var constants_1 = require("../src/constants");
var supertest = require("supertest");
var decorators_1 = require("../src/decorators");
describe("Unit Test: Previous bugs", function () {
    it("should support multiple controller methods with param annotations", function (done) {
        var container = new inversify_1.Container();
        var TestController = /** @class */ (function () {
            function TestController() {
            }
            TestController.prototype.get = function (req, res) {
                chai_1.expect(req.url).not.to.eql(undefined);
                chai_1.expect(req.setHeader).to.eql(undefined);
                chai_1.expect(res.setHeader).not.to.eql(undefined);
                chai_1.expect(res.url).to.eql(undefined);
                res.json([{ id: 1 }, { id: 2 }]);
            };
            TestController.prototype.getById = function (id, req, res) {
                chai_1.expect(id).to.eql("5");
                chai_1.expect(req.url).not.to.eql(undefined);
                chai_1.expect(req.setHeader).to.eql(undefined);
                chai_1.expect(res.setHeader).not.to.eql(undefined);
                chai_1.expect(res.url).to.eql(undefined);
                res.json({ id: id });
            };
            __decorate([
                decorators_1.httpGet("/"),
                __param(0, decorators_1.request()),
                __param(1, decorators_1.response()),
                __metadata("design:type", Function),
                __metadata("design:paramtypes", [Object, Object]),
                __metadata("design:returntype", void 0)
            ], TestController.prototype, "get", null);
            __decorate([
                decorators_1.httpGet("/:id"),
                __param(0, decorators_1.requestParam("id")),
                __param(1, decorators_1.request()),
                __param(2, decorators_1.response()),
                __metadata("design:type", Function),
                __metadata("design:paramtypes", [String, Object, Object]),
                __metadata("design:returntype", void 0)
            ], TestController.prototype, "getById", null);
            TestController = __decorate([
                inversify_1.injectable(),
                decorators_1.controller("/api/test")
            ], TestController);
            return TestController;
        }());
        container.bind(constants_1.TYPE.Controller).to(TestController);
        var server = new server_1.InversifyExpressServer(container);
        var app = server.build();
        supertest(app).get("/api/test/")
            .expect("Content-Type", /json/)
            .expect(200)
            .then(function (response1) {
            chai_1.expect(Array.isArray(response1.body)).to.eql(true);
            chai_1.expect(response1.body[0].id).to.eql(1);
            chai_1.expect(response1.body[1].id).to.eql(2);
        });
        supertest(app).get("/api/test/5")
            .expect("Content-Type", /json/)
            .expect(200)
            .then(function (response2) {
            chai_1.expect(Array.isArray(response2.body)).to.eql(false);
            chai_1.expect(response2.body.id).to.eql("5");
            done();
        });
    });
    it("should support empty query params", function (done) {
        var container = new inversify_1.Container();
        var TestController = /** @class */ (function () {
            function TestController() {
            }
            TestController.prototype.get = function (req, res, empty, test) {
                return { empty: empty, test: test };
            };
            __decorate([
                decorators_1.httpGet("/"),
                __param(0, decorators_1.request()),
                __param(1, decorators_1.response()),
                __param(2, decorators_1.queryParam("empty")),
                __param(3, decorators_1.queryParam("test")),
                __metadata("design:type", Function),
                __metadata("design:paramtypes", [Object, Object, String, String]),
                __metadata("design:returntype", void 0)
            ], TestController.prototype, "get", null);
            TestController = __decorate([
                inversify_1.injectable(),
                decorators_1.controller("/api/test")
            ], TestController);
            return TestController;
        }());
        container.bind(constants_1.TYPE.Controller).to(TestController);
        var server = new server_1.InversifyExpressServer(container);
        var app = server.build();
        supertest(app).get("/api/test?test=testquery")
            .expect("Content-Type", /json/)
            .expect(200)
            .then(function (response1) {
            chai_1.expect(response1.body.test).to.eql("testquery");
            chai_1.expect(response1.body.empty).to.eq(undefined);
            done();
        });
    });
});
