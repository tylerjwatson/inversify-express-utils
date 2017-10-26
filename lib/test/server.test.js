"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
// test libraries
var chai_1 = require("chai");
var sinon = require("sinon");
// dependencies
var express = require("express");
var server_1 = require("../src/server");
var inversify_1 = require("inversify");
var constants_1 = require("../src/constants");
describe("Unit Test: InversifyExpressServer", function () {
    it("should call the configFn before the errorConfigFn", function (done) {
        var middleware = function (req, res, next) { return; };
        var configFn = sinon.spy(function (app) { app.use(middleware); });
        var errorConfigFn = sinon.spy(function (app) { app.use(middleware); });
        var container = new inversify_1.Container();
        var TestController = /** @class */ (function () {
            function TestController() {
            }
            TestController = __decorate([
                inversify_1.injectable()
            ], TestController);
            return TestController;
        }());
        container.bind(constants_1.TYPE.Controller).to(TestController);
        var server = new server_1.InversifyExpressServer(container);
        server.setConfig(configFn)
            .setErrorConfig(errorConfigFn);
        chai_1.expect(configFn.called).to.eq(false);
        chai_1.expect(errorConfigFn.called).to.eq(false);
        server.build();
        chai_1.expect(configFn.calledOnce).to.eqls(true);
        chai_1.expect(errorConfigFn.calledOnce).to.eqls(true);
        chai_1.expect(configFn.calledBefore(errorConfigFn)).to.eqls(true);
        done();
    });
    it("Should allow to pass a custom Router instance as config", function () {
        var container = new inversify_1.Container();
        var customRouter = express.Router({
            caseSensitive: false,
            mergeParams: false,
            strict: false
        });
        var serverWithDefaultRouter = new server_1.InversifyExpressServer(container);
        var serverWithCustomRouter = new server_1.InversifyExpressServer(container, customRouter);
        chai_1.expect(serverWithDefaultRouter._router === customRouter).to.eq(false);
        chai_1.expect(serverWithCustomRouter._router === customRouter).to.eqls(true);
    });
    it("Should allow to provide custom routing configuration", function () {
        var container = new inversify_1.Container();
        var routingConfig = {
            rootPath: "/such/root/path"
        };
        var serverWithDefaultConfig = new server_1.InversifyExpressServer(container);
        var serverWithCustomConfig = new server_1.InversifyExpressServer(container, null, routingConfig);
        chai_1.expect(serverWithCustomConfig._routingConfig).to.eq(routingConfig);
        chai_1.expect(serverWithDefaultConfig._routingConfig).to.not.eql(serverWithCustomConfig._routingConfig);
    });
    it("Should allow to provide a custom express application", function () {
        var container = new inversify_1.Container();
        var app = express();
        var serverWithDefaultApp = new server_1.InversifyExpressServer(container);
        var serverWithCustomApp = new server_1.InversifyExpressServer(container, null, null, app);
        chai_1.expect(serverWithCustomApp._app).to.eq(app);
        chai_1.expect(serverWithDefaultApp._app).to.not.eql(serverWithCustomApp._app);
    });
});
