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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.attachGraphqlInstance = exports.setGraphqlConfig = void 0;
var prompts = require("prompts");
var writeEnv_1 = require("./helpers/writeEnv");
var copyToGraphql_1 = require("./helpers/copyToGraphql");
var reWriteFile_1 = __importDefault(require("./helpers/reWriteFile"));
var removeSpecialChars = require("@gluestack/helpers").removeSpecialChars;
var setGraphqlConfig = function (storageInstance, graphqlInstance) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        storageInstance.gluePluginStore.set("graphql_instance", graphqlInstance.getName());
        graphqlInstance.gluePluginStore.set("storage_instance", storageInstance.getName());
        return [2, storageInstance.gluePluginStore.get("graphql_instance")];
    });
}); };
exports.setGraphqlConfig = setGraphqlConfig;
function selectGraphqlInstance(graphqlInstances) {
    return __awaiter(this, void 0, void 0, function () {
        var choices, value;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    choices = graphqlInstances.map(function (graphqlInstance) {
                        return {
                            title: "".concat(graphqlInstance.getName()),
                            description: "Will attach graphql \"".concat(graphqlInstance.getName(), "\""),
                            value: graphqlInstance
                        };
                    });
                    return [4, prompts({
                            type: "select",
                            name: "value",
                            message: "Select a graphql instance",
                            choices: choices
                        })];
                case 1:
                    value = (_a.sent()).value;
                    return [2, value];
            }
        });
    });
}
function attachGraphqlInstance(storageInstance, graphqlInstances) {
    return __awaiter(this, void 0, void 0, function () {
        var graphqlInstance, routerFilePath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, selectGraphqlInstance(graphqlInstances)];
                case 1:
                    graphqlInstance = _a.sent();
                    if (!graphqlInstance) return [3, 6];
                    return [4, (0, exports.setGraphqlConfig)(storageInstance, graphqlInstance)];
                case 2:
                    _a.sent();
                    return [4, (0, writeEnv_1.writeEnv)(storageInstance, graphqlInstance)];
                case 3:
                    _a.sent();
                    return [4, (0, copyToGraphql_1.copyToGraphql)(storageInstance, graphqlInstance)];
                case 4:
                    _a.sent();
                    routerFilePath = "".concat(storageInstance.getInstallationPath(), "/router.js");
                    return [4, (0, reWriteFile_1["default"])(routerFilePath, removeSpecialChars(storageInstance.getName()), "services")];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6: return [2];
            }
        });
    });
}
exports.attachGraphqlInstance = attachGraphqlInstance;
//# sourceMappingURL=attachGraphqlInstance.js.map