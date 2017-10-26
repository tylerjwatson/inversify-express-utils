"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var constants_1 = require("./constants");
/**
 * Wrapper for the express server.
 */
var InversifyExpressServer = /** @class */ (function () {
    /**
     * Wrapper for the express server.
     *
     * @param container Container loaded with all controllers and their dependencies.
     */
    function InversifyExpressServer(container, customRouter, routingConfig, customApp) {
        this._container = container;
        this._router = customRouter || express.Router();
        this._routingConfig = routingConfig || {
            rootPath: constants_1.DEFAULT_ROUTING_ROOT_PATH
        };
        this._app = customApp || express();
    }
    /**
     * Sets the configuration function to be applied to the application.
     * Note that the config function is not actually executed until a call to InversifyExpresServer.build().
     *
     * This method is chainable.
     *
     * @param fn Function in which app-level middleware can be registered.
     */
    InversifyExpressServer.prototype.setConfig = function (fn) {
        this._configFn = fn;
        return this;
    };
    /**
     * Sets the error handler configuration function to be applied to the application.
     * Note that the error config function is not actually executed until a call to InversifyExpresServer.build().
     *
     * This method is chainable.
     *
     * @param fn Function in which app-level error handlers can be registered.
     */
    InversifyExpressServer.prototype.setErrorConfig = function (fn) {
        this._errorConfigFn = fn;
        return this;
    };
    /**
     * Applies all routes and configuration to the server, returning the express application.
     */
    InversifyExpressServer.prototype.build = function () {
        // register server-level middleware before anything else
        if (this._configFn) {
            this._configFn.apply(undefined, [this._app]);
        }
        this.registerControllers();
        // register error handlers after controllers
        if (this._errorConfigFn) {
            this._errorConfigFn.apply(undefined, [this._app]);
        }
        return this._app;
    };
    InversifyExpressServer.prototype.registerControllers = function () {
        var _this = this;
        var controllers = this._container.getAll(constants_1.TYPE.Controller);
        controllers.forEach(function (controller) {
            var controllerMetadata = Reflect.getOwnMetadata(constants_1.METADATA_KEY.controller, controller.constructor);
            var methodMetadata = Reflect.getOwnMetadata(constants_1.METADATA_KEY.controllerMethod, controller.constructor);
            var parameterMetadata = Reflect.getOwnMetadata(constants_1.METADATA_KEY.controllerParameter, controller.constructor);
            if (controllerMetadata && methodMetadata) {
                var router = express.Router();
                var controllerMiddleware_1 = _this.resolveMidleware.apply(_this, controllerMetadata.middleware);
                methodMetadata.forEach(function (metadata) {
                    var paramList = [];
                    if (parameterMetadata) {
                        paramList = parameterMetadata[metadata.key] || [];
                    }
                    var handler = _this.handlerFactory(controllerMetadata.target.name, metadata.key, paramList);
                    var routeMiddleware = _this.resolveMidleware.apply(_this, metadata.middleware);
                    (_a = _this._router)[metadata.method].apply(_a, ["" + controllerMetadata.path + metadata.path].concat(controllerMiddleware_1, routeMiddleware, [handler]));
                    var _a;
                });
            }
        });
        this._app.use(this._routingConfig.rootPath, this._router);
    };
    InversifyExpressServer.prototype.resolveMidleware = function () {
        var _this = this;
        var middleware = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            middleware[_i] = arguments[_i];
        }
        return middleware.map(function (middlewareItem) {
            try {
                return _this._container.get(middlewareItem);
            }
            catch (_) {
                return middlewareItem;
            }
        });
    };
    InversifyExpressServer.prototype.handlerFactory = function (controllerName, key, parameterMetadata) {
        var _this = this;
        return function (req, res, next) {
            var args = _this.extractParameters(req, res, next, parameterMetadata);
            var result = (_a = _this._container.getNamed(constants_1.TYPE.Controller, controllerName))[key].apply(_a, args);
            Promise.resolve(result)
                .then(function (value) {
                if (value && !res.headersSent) {
                    res.send(value);
                }
            })
                .catch(function (error) {
                next(error);
            });
            var _a;
        };
    };
    InversifyExpressServer.prototype.extractParameters = function (req, res, next, params) {
        var args = [];
        if (!params || !params.length) {
            return [req, res, next];
        }
        for (var _i = 0, params_1 = params; _i < params_1.length; _i++) {
            var item = params_1[_i];
            switch (item.type) {
                default:
                    args[item.index] = res;
                    break; // response
                case constants_1.PARAMETER_TYPE.REQUEST:
                    args[item.index] = this.getParam(req, null, item.parameterName);
                    break;
                case constants_1.PARAMETER_TYPE.NEXT:
                    args[item.index] = next;
                    break;
                case constants_1.PARAMETER_TYPE.PARAMS:
                    args[item.index] = this.getParam(req, "params", item.parameterName);
                    break;
                case constants_1.PARAMETER_TYPE.QUERY:
                    args[item.index] = this.getParam(req, "query", item.parameterName);
                    break;
                case constants_1.PARAMETER_TYPE.BODY:
                    args[item.index] = this.getParam(req, "body", item.parameterName);
                    break;
                case constants_1.PARAMETER_TYPE.HEADERS:
                    args[item.index] = this.getParam(req, "headers", item.parameterName);
                    break;
                case constants_1.PARAMETER_TYPE.COOKIES:
                    args[item.index] = this.getParam(req, "cookies", item.parameterName);
                    break;
            }
        }
        args.push(req, res, next);
        return args;
    };
    InversifyExpressServer.prototype.getParam = function (source, paramType, name) {
        var param = source[paramType] || source;
        return param[name] || this.checkQueryParam(paramType, param);
    };
    InversifyExpressServer.prototype.checkQueryParam = function (paramType, param) {
        if (paramType === "query") {
            return undefined;
        }
        else {
            return param;
        }
    };
    return InversifyExpressServer;
}());
exports.InversifyExpressServer = InversifyExpressServer;
