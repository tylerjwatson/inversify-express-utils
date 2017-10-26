"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("./constants");
function controller(path) {
    var middleware = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        middleware[_i - 1] = arguments[_i];
    }
    return function (target) {
        var metadata = { path: path, middleware: middleware, target: target };
        Reflect.defineMetadata(constants_1.METADATA_KEY.controller, metadata, target);
    };
}
exports.controller = controller;
function all(path) {
    var middleware = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        middleware[_i - 1] = arguments[_i];
    }
    return httpMethod.apply(void 0, ["all", path].concat(middleware));
}
exports.all = all;
function httpGet(path) {
    var middleware = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        middleware[_i - 1] = arguments[_i];
    }
    return httpMethod.apply(void 0, ["get", path].concat(middleware));
}
exports.httpGet = httpGet;
function httpPost(path) {
    var middleware = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        middleware[_i - 1] = arguments[_i];
    }
    return httpMethod.apply(void 0, ["post", path].concat(middleware));
}
exports.httpPost = httpPost;
function httpPut(path) {
    var middleware = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        middleware[_i - 1] = arguments[_i];
    }
    return httpMethod.apply(void 0, ["put", path].concat(middleware));
}
exports.httpPut = httpPut;
function httpPatch(path) {
    var middleware = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        middleware[_i - 1] = arguments[_i];
    }
    return httpMethod.apply(void 0, ["patch", path].concat(middleware));
}
exports.httpPatch = httpPatch;
function httpHead(path) {
    var middleware = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        middleware[_i - 1] = arguments[_i];
    }
    return httpMethod.apply(void 0, ["head", path].concat(middleware));
}
exports.httpHead = httpHead;
function httpDelete(path) {
    var middleware = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        middleware[_i - 1] = arguments[_i];
    }
    return httpMethod.apply(void 0, ["delete", path].concat(middleware));
}
exports.httpDelete = httpDelete;
function httpMethod(method, path) {
    var middleware = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        middleware[_i - 2] = arguments[_i];
    }
    return function (target, key, value) {
        var metadata = { path: path, middleware: middleware, method: method, target: target, key: key };
        var metadataList = [];
        if (!Reflect.hasOwnMetadata(constants_1.METADATA_KEY.controllerMethod, target.constructor)) {
            Reflect.defineMetadata(constants_1.METADATA_KEY.controllerMethod, metadataList, target.constructor);
        }
        else {
            metadataList = Reflect.getOwnMetadata(constants_1.METADATA_KEY.controllerMethod, target.constructor);
        }
        metadataList.push(metadata);
    };
}
exports.httpMethod = httpMethod;
exports.request = paramDecoratorFactory(constants_1.PARAMETER_TYPE.REQUEST);
exports.response = paramDecoratorFactory(constants_1.PARAMETER_TYPE.RESPONSE);
exports.requestParam = paramDecoratorFactory(constants_1.PARAMETER_TYPE.PARAMS);
exports.queryParam = paramDecoratorFactory(constants_1.PARAMETER_TYPE.QUERY);
exports.requestBody = paramDecoratorFactory(constants_1.PARAMETER_TYPE.BODY);
exports.requestHeaders = paramDecoratorFactory(constants_1.PARAMETER_TYPE.HEADERS);
exports.cookies = paramDecoratorFactory(constants_1.PARAMETER_TYPE.COOKIES);
exports.next = paramDecoratorFactory(constants_1.PARAMETER_TYPE.NEXT);
function paramDecoratorFactory(parameterType) {
    return function (name) {
        name = name || "default";
        return params(parameterType, name);
    };
}
function params(type, parameterName) {
    return function (target, methodName, index) {
        var metadataList = {};
        var parameterMetadataList = [];
        var parameterMetadata = {
            index: index,
            parameterName: parameterName,
            type: type
        };
        if (!Reflect.hasOwnMetadata(constants_1.METADATA_KEY.controllerParameter, target.constructor)) {
            parameterMetadataList.unshift(parameterMetadata);
        }
        else {
            metadataList = Reflect.getOwnMetadata(constants_1.METADATA_KEY.controllerParameter, target.constructor);
            if (metadataList.hasOwnProperty(methodName)) {
                parameterMetadataList = metadataList[methodName];
            }
            parameterMetadataList.unshift(parameterMetadata);
        }
        metadataList[methodName] = parameterMetadataList;
        Reflect.defineMetadata(constants_1.METADATA_KEY.controllerParameter, metadataList, target.constructor);
    };
}
exports.params = params;