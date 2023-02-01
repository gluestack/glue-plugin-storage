"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.PluginInstanceContainerController = void 0;
var _a = require("@gluestack/helpers"), SpawnHelper = _a.SpawnHelper, DockerodeHelper = _a.DockerodeHelper;
var GlobalEnv = require("@gluestack/helpers").GlobalEnv;
var PluginInstanceContainerController = (function () {
    function PluginInstanceContainerController(app, callerInstance) {
        this.status = "down";
        this.app = app;
        this.callerInstance = callerInstance;
        this.setStatus(this.callerInstance.gluePluginStore.get("status"));
        this.setPortNumber(this.callerInstance.gluePluginStore.get("port_number"));
        this.setContainerId(this.callerInstance.gluePluginStore.get("container_id"));
    }
    PluginInstanceContainerController.prototype.getFromGlobalEnv = function (key, defaultValue) {
        return __awaiter(this, void 0, void 0, function () {
            var value;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, GlobalEnv.get(this.callerInstance.getName(), key)];
                    case 1:
                        value = _a.sent();
                        if (!!value) return [3, 3];
                        return [4, GlobalEnv.set(this.callerInstance.getName(), key, defaultValue)];
                    case 2:
                        _a.sent();
                        return [2, defaultValue];
                    case 3: return [2, value];
                }
            });
        });
    };
    PluginInstanceContainerController.prototype.getCallerInstance = function () {
        return this.callerInstance;
    };
    PluginInstanceContainerController.prototype.installScript = function () {
        return ["npm", "install"];
    };
    PluginInstanceContainerController.prototype.runScript = function () {
        return ["npm", "run", "dev"];
    };
    PluginInstanceContainerController.prototype.buildScript = function () {
        return ["npm", "run", "build"];
    };
    PluginInstanceContainerController.prototype.getEnv = function () {
        return __awaiter(this, void 0, void 0, function () {
            var minioEnv, env, _a, _b, _c, _i, key, _d, _e, _f, _g, _h;
            return __generator(this, function (_j) {
                switch (_j.label) {
                    case 0: return [4, this.callerInstance
                            .getMinioInstance()
                            .getContainerController()
                            .getEnv()];
                    case 1:
                        minioEnv = _j.sent();
                        env = {};
                        _a = minioEnv;
                        _b = [];
                        for (_c in _a)
                            _b.push(_c);
                        _i = 0;
                        _j.label = 2;
                    case 2:
                        if (!(_i < _b.length)) return [3, 5];
                        _c = _b[_i];
                        if (!(_c in _a)) return [3, 4];
                        key = _c;
                        _d = env;
                        _e = key;
                        return [4, this.getFromGlobalEnv(key, minioEnv[key])];
                    case 3:
                        _d[_e] = _j.sent();
                        _j.label = 4;
                    case 4:
                        _i++;
                        return [3, 2];
                    case 5:
                        _f = env;
                        _g = this.getFromGlobalEnv;
                        _h = ["APP_PORT"];
                        return [4, this.getPortNumber()];
                    case 6: return [4, _g.apply(this, _h.concat([(_j.sent()).toString()]))];
                    case 7:
                        _f.APP_PORT = _j.sent();
                        return [2, env];
                }
            });
        });
    };
    PluginInstanceContainerController.prototype.getDockerJson = function () {
        return {};
    };
    PluginInstanceContainerController.prototype.getStatus = function () {
        return this.status;
    };
    PluginInstanceContainerController.prototype.getPortNumber = function (returnDefault) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2, new Promise(function (resolve, reject) {
                        if (_this.portNumber) {
                            return resolve(_this.portNumber);
                        }
                        var port = 9090;
                        _this.setPortNumber(port);
                        return resolve(_this.portNumber);
                    })];
            });
        });
    };
    PluginInstanceContainerController.prototype.getContainerId = function () {
        return this.containerId;
    };
    PluginInstanceContainerController.prototype.setStatus = function (status) {
        this.callerInstance.gluePluginStore.set("status", status || "down");
        return (this.status = status || "down");
    };
    PluginInstanceContainerController.prototype.setPortNumber = function (portNumber) {
        this.callerInstance.gluePluginStore.set("port_number", portNumber || null);
        return (this.portNumber = portNumber || null);
    };
    PluginInstanceContainerController.prototype.setContainerId = function (containerId) {
        this.callerInstance.gluePluginStore.set("container_id", containerId || null);
        return (this.containerId = containerId || null);
    };
    PluginInstanceContainerController.prototype.getConfig = function () { };
    PluginInstanceContainerController.prototype.up = function () {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function () {
            var _f, _g, _h;
            var _this = this;
            return __generator(this, function (_j) {
                switch (_j.label) {
                    case 0: return [2];
                    case 1:
                        _j.sent();
                        _j.label = 2;
                    case 2: return [4, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                            var _this = this;
                            return __generator(this, function (_a) {
                                console.log("\x1b[33m");
                                console.log("".concat(this.callerInstance.getName(), ": Running \"").concat(this.installScript().join(" "), "\""), "\x1b[0m");
                                SpawnHelper.run(this.callerInstance.getInstallationPath(), this.installScript())
                                    .then(function () {
                                    console.log("\x1b[33m");
                                    console.log("".concat(_this.callerInstance.getName(), ": Running \"").concat(_this.runScript().join(" "), "\""), "\x1b[0m");
                                    SpawnHelper.start(_this.callerInstance.getInstallationPath(), _this.runScript())
                                        .then(function (_a) {
                                        var processId = _a.processId;
                                        return __awaiter(_this, void 0, void 0, function () {
                                            var _b, _c, _d;
                                            return __generator(this, function (_e) {
                                                switch (_e.label) {
                                                    case 0:
                                                        this.setStatus("up");
                                                        this.setContainerId(processId);
                                                        console.log("\x1b[32m");
                                                        _c = (_b = console).log;
                                                        _d = "Use http://localhost:".concat;
                                                        return [4, this.getPortNumber()];
                                                    case 1:
                                                        _c.apply(_b, [_d.apply("Use http://localhost:", [_e.sent(), "/upload as your storage endpoint"])]);
                                                        console.log("\x1b[0m");
                                                        return [2, resolve(true)];
                                                }
                                            });
                                        });
                                    })["catch"](function (e) {
                                        return reject(e);
                                    });
                                })["catch"](function (e) {
                                    return reject(e);
                                });
                                return [2];
                            });
                        }); })];
                    case 3:
                        _j.sent();
                        return [3, 6];
                    case 4:
                        console.log("\x1b[32m");
                        _g = (_f = console).log;
                        _h = "Use http://localhost:".concat;
                        return [4, this.getPortNumber()];
                    case 5:
                        _g.apply(_f, [_h.apply("Use http://localhost:", [_j.sent(), "/upload as your storage endpoint"])]);
                        console.log("\x1b[0m");
                        _j.label = 6;
                    case 6: return [2];
                }
            });
        });
    };
    PluginInstanceContainerController.prototype.down = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [2];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2];
                }
            });
        });
    };
    PluginInstanceContainerController.prototype.build = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, SpawnHelper.run(this.callerInstance.getInstallationPath(), this.installScript())];
                    case 1:
                        _a.sent();
                        return [4, SpawnHelper.run(this.callerInstance.getInstallationPath(), this.buildScript())];
                    case 2:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    PluginInstanceContainerController.prototype.getRoutes = function () {
        return __awaiter(this, void 0, void 0, function () {
            var routes;
            return __generator(this, function (_a) {
                routes = [
                    { method: "POST", path: "/upload" },
                    { method: "GET", path: "/get/{id}" }
                ];
                return [2, Promise.resolve(routes)];
            });
        });
    };
    return PluginInstanceContainerController;
}());
exports.PluginInstanceContainerController = PluginInstanceContainerController;
//# sourceMappingURL=PluginInstanceContainerController.js.map