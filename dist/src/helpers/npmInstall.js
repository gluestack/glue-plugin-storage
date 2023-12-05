"use strict";
exports.__esModule = true;
exports.npmInstall = void 0;
var SpawnHelper = require("@gluestack/helpers").SpawnHelper;
function installScript() {
    return ["npm", "install"];
}
function npmInstall(pluginInstance) {
    return new Promise(function (resolve, reject) {
        console.log("\x1b[33m");
        console.log("".concat(pluginInstance.getName(), ": Running `").concat(installScript().join(" "), "`"));
        console.log("\x1b[0m");
        SpawnHelper.start(pluginInstance.getInstallationPath(), installScript())
            .then(function (resp) {
            return resolve(true);
        })["catch"](function (e) {
            return reject(e);
        });
    });
}
exports.npmInstall = npmInstall;
//# sourceMappingURL=npmInstall.js.map