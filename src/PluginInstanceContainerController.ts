const { SpawnHelper, DockerodeHelper } = require("@gluestack/helpers");
import IApp from "@gluestack/framework/types/app/interface/IApp";
import IContainerController, { IRoutes } from "@gluestack/framework/types/plugin/interface/IContainerController";
import { PluginInstance } from "./PluginInstance";
const { GlobalEnv } = require("@gluestack/helpers");

export class PluginInstanceContainerController implements IContainerController {
  app: IApp;
  status: "up" | "down" = "down";
  portNumber: number;
  containerId: string;
  callerInstance: PluginInstance;

  constructor(app: IApp, callerInstance: PluginInstance) {
    this.app = app;
    this.callerInstance = callerInstance;
    this.setStatus(this.callerInstance.gluePluginStore.get("status"));
    this.setPortNumber(this.callerInstance.gluePluginStore.get("port_number"));
    this.setContainerId(
      this.callerInstance.gluePluginStore.get("container_id"),
    );
  }

  async getFromGlobalEnv(key: string, defaultValue?: string) {
    const value = await GlobalEnv.get(this.callerInstance.getName(), key);
    if (!value) {
      await GlobalEnv.set(this.callerInstance.getName(), key, defaultValue);
      return defaultValue;
    }
    return value;
  }

  getCallerInstance(): PluginInstance {
    return this.callerInstance;
  }

  installScript() {
    return ["npm", "install"];
  }

  runScript() {
    return ["npm", "run", "dev"];
  }

  buildScript() {
    return ["npm", "run", "build"];
  }

  async getEnv() {
    const minioEnv: any = await this.callerInstance
      .getMinioInstance()
      .getContainerController()
      .getEnv();

    const env: any = {};
    for (const key in minioEnv) {
      env[key] = await this.getFromGlobalEnv(key, minioEnv[key]);
    }

    env.APP_PORT = await this.getFromGlobalEnv(
      "APP_PORT",
      (await this.getPortNumber()).toString(),
    );

    return env;
  }

  getDockerJson() {
    return {};
  }

  getStatus(): "up" | "down" {
    return this.status;
  }

  //@ts-ignore
  async getPortNumber(returnDefault?: boolean) {
    return new Promise((resolve, reject) => {
      if (this.portNumber) {
        return resolve(this.portNumber);
      }
      const port = 9000;
      this.setPortNumber(port);
      return resolve(this.portNumber);
    });
  }

  getContainerId(): string {
    return this.containerId;
  }

  setStatus(status: "up" | "down") {
    this.callerInstance.gluePluginStore.set("status", status || "down");
    return (this.status = status || "down");
  }

  setPortNumber(portNumber: number) {
    this.callerInstance.gluePluginStore.set("port_number", portNumber || null);
    return (this.portNumber = portNumber || null);
  }

  setContainerId(containerId: string) {
    this.callerInstance.gluePluginStore.set(
      "container_id",
      containerId || null,
    );
    return (this.containerId = containerId || null);
  }

  getConfig(): any { }

  async up() {
    //
  }

  async down() {
    //
  }

  async build() {
    await SpawnHelper.run(
      this.callerInstance.getInstallationPath(),
      this.installScript()
    );
    await SpawnHelper.run(
      this.callerInstance.getInstallationPath(),
      this.buildScript()
    );
  }

  async getRoutes(): Promise<IRoutes[]> {
    const routes: IRoutes[] = [
      { method: "POST", path: "/upload" },
      { method: "GET", path: "/get/{id}" }
    ];

    return Promise.resolve(routes);
  }
}
