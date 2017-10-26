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
var decorators_1 = require("../src/decorators");
var constants_1 = require("../src/constants");
describe("Unit Test: Controller Decorators", function () {
    it("should add controller metadata to a class when decorated with @controller", function (done) {
        var middleware = [function () { return; }, "foo", Symbol("bar")];
        var path = "foo";
        var TestController = /** @class */ (function () {
            function TestController() {
            }
            TestController = __decorate([
                decorators_1.controller.apply(void 0, [path].concat(middleware))
            ], TestController);
            return TestController;
        }());
        var controllerMetadata = Reflect.getMetadata("_controller", TestController);
        chai_1.expect(controllerMetadata.middleware).eql(middleware);
        chai_1.expect(controllerMetadata.path).eql(path);
        chai_1.expect(controllerMetadata.target).eql(TestController);
        done();
    });
    it("should add method metadata to a class when decorated with @httpMethod", function (done) {
        var middleware = [function () { return; }, "bar", Symbol("baz")];
        var path = "foo";
        var method = "get";
        var TestController = /** @class */ (function () {
            function TestController() {
            }
            TestController.prototype.test = function () { return; };
            TestController.prototype.test2 = function () { return; };
            TestController.prototype.test3 = function () { return; };
            __decorate([
                decorators_1.httpMethod.apply(void 0, [method, path].concat(middleware)),
                __metadata("design:type", Function),
                __metadata("design:paramtypes", []),
                __metadata("design:returntype", void 0)
            ], TestController.prototype, "test", null);
            __decorate([
                decorators_1.httpMethod("foo", "bar"),
                __metadata("design:type", Function),
                __metadata("design:paramtypes", []),
                __metadata("design:returntype", void 0)
            ], TestController.prototype, "test2", null);
            __decorate([
                decorators_1.httpMethod("bar", "foo"),
                __metadata("design:type", Function),
                __metadata("design:paramtypes", []),
                __metadata("design:returntype", void 0)
            ], TestController.prototype, "test3", null);
            return TestController;
        }());
        var methodMetadata = Reflect.getMetadata("_controller-method", TestController);
        chai_1.expect(methodMetadata.length).eql(3);
        var metadata = methodMetadata[0];
        chai_1.expect(metadata.middleware).eql(middleware);
        chai_1.expect(metadata.path).eql(path);
        chai_1.expect(metadata.target.constructor).eql(TestController);
        chai_1.expect(metadata.key).eql("test");
        chai_1.expect(metadata.method).eql(method);
        done();
    });
    it("should add parameter metadata to a class when decorated with @params", function (done) {
        var middleware = [function () { return; }, "bar", Symbol("baz")];
        var path = "foo";
        var method = "get";
        var methodName = "test";
        var TestController = /** @class */ (function () {
            function TestController() {
            }
            TestController.prototype.test = function (id, cat) { return; };
            TestController.prototype.test2 = function (dog) { return; };
            TestController.prototype.test3 = function () { return; };
            __decorate([
                decorators_1.httpMethod.apply(void 0, [method, path].concat(middleware)),
                __param(0, decorators_1.params(constants_1.PARAMETER_TYPE.PARAMS, "id")), __param(1, decorators_1.params(constants_1.PARAMETER_TYPE.PARAMS, "cat")),
                __metadata("design:type", Function),
                __metadata("design:paramtypes", [Object, Object]),
                __metadata("design:returntype", void 0)
            ], TestController.prototype, "test", null);
            __decorate([
                decorators_1.httpMethod("foo", "bar"),
                __param(0, decorators_1.params(constants_1.PARAMETER_TYPE.PARAMS, "dog")),
                __metadata("design:type", Function),
                __metadata("design:paramtypes", [Object]),
                __metadata("design:returntype", void 0)
            ], TestController.prototype, "test2", null);
            __decorate([
                decorators_1.httpMethod("bar", "foo"),
                __metadata("design:type", Function),
                __metadata("design:paramtypes", []),
                __metadata("design:returntype", void 0)
            ], TestController.prototype, "test3", null);
            return TestController;
        }());
        var methodMetadataList = Reflect.getMetadata(constants_1.METADATA_KEY.controllerParameter, TestController);
        chai_1.expect(methodMetadataList.hasOwnProperty("test")).to.eqls(true);
        var paramaterMetadataList = methodMetadataList[methodName];
        chai_1.expect(paramaterMetadataList.length).eql(2);
        var paramaterMetadata = paramaterMetadataList[0];
        chai_1.expect(paramaterMetadata.index).eql(0);
        chai_1.expect(paramaterMetadata.parameterName).eql("id");
        done();
    });
});
