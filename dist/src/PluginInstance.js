"use strict";
exports.__esModule = true;
exports.PluginInstance = void 0;
var PluginInstanceContainerController_1 = require("./PluginInstanceContainerController");
var PluginInstance = (function () {
    function PluginInstance(app, callerPlugin, name, gluePluginStore, installationPath) {
        this.isOfTypeInstance = false;
        this.app = app;
        this.name = name;
        this.callerPlugin = callerPlugin;
        this.gluePluginStore = gluePluginStore;
        this.installationPath = installationPath;
        this.containerController = new PluginInstanceContainerController_1.PluginInstanceContainerController(app, this);
    }
    PluginInstance.prototype.init = function () {
    };
    PluginInstance.prototype.destroy = function () {
    };
    PluginInstance.prototype.getName = function () {
        return this.name;
    };
    PluginInstance.prototype.getCallerPlugin = function () {
        return this.callerPlugin;
    };
    PluginInstance.prototype.getInstallationPath = function () {
        return this.installationPath;
    };
    PluginInstance.prototype.getContainerController = function () {
        return this.containerController;
    };
    PluginInstance.prototype.getMinioInstance = function () {
        var minioInstance = null;
        var minio_instance = this.gluePluginStore.get("minio_instance");
        if (minio_instance) {
            var plugin = this.app.getPluginByName("@gluestack/glue-plugin-minio");
            if (plugin) {
                plugin.getInstances().forEach(function (instance) {
                    if (instance.getName() === minio_instance) {
                        minioInstance = instance;
                    }
                });
            }
            return minioInstance;
        }
    };
    PluginInstance.prototype.getGraphqlInstance = function () {
        var graphqlInstance = null;
        var graphql_instance = this.gluePluginStore.get("graphql_instance");
        if (graphql_instance) {
            var plugin = this.app.getPluginByName("@gluestack/glue-plugin-graphql");
            if (plugin) {
                plugin.getInstances().forEach(function (instance) {
                    if (instance.getName() === graphql_instance) {
                        graphqlInstance = instance;
                    }
                });
            }
            return graphqlInstance;
        }
    };
    return PluginInstance;
}());
exports.PluginInstance = PluginInstance;
//# sourceMappingURL=PluginInstance.js.map