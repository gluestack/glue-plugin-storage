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
      const port = 9090;
      this.setPortNumber(port);
      return resolve(this.portNumber);
      /*
      let ports =
        this.callerInstance.callerPlugin.gluePluginStore.get("ports") || [];
      DockerodeHelper.getPort(9000, ports)
      .then((port: number) => {
          this.setPortNumber(port);
          ports.push(port);
          this.callerInstance.callerPlugin.gluePluginStore.set("ports", ports);
          return resolve(this.portNumber);
        })
        .catch((e: any) => {
          reject(e);
        });
        */
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
    return;
    if (this.getStatus() !== "up") {
      if (!this.callerInstance.getMinioInstance()) {
        throw new Error(
          `No minio instance attached with ${this.callerInstance.getName()}`,
        );
      }
      if (!this.callerInstance.getMinioInstance()?.getContainerController()) {
        throw new Error(
          `Not a valid minio storage configured with ${this.callerInstance.getName()}`,
        );
      }
      if (
        this.callerInstance
          .getMinioInstance()
          ?.getContainerController()
          ?.getStatus() !== "up"
      ) {
        await this.callerInstance
          .getMinioInstance()
          ?.getContainerController()
          ?.up();
      }

      await new Promise(async (resolve, reject) => {
        console.log("\x1b[33m");
        console.log(
          `${this.callerInstance.getName()}: Running "${this.installScript().join(
            " ",
          )}"`,
          "\x1b[0m",
        );
        SpawnHelper.run(
          this.callerInstance.getInstallationPath(),
          this.installScript(),
        )
          .then(() => {
            console.log("\x1b[33m");
            console.log(
              `${this.callerInstance.getName()}: Running "${this.runScript().join(
                " ",
              )}"`,
              "\x1b[0m",
            );
            SpawnHelper.start(
              this.callerInstance.getInstallationPath(),
              this.runScript(),
            )
              .then(async ({ processId }: { processId: string }) => {
                this.setStatus("up");
                this.setContainerId(processId);
                console.log("\x1b[32m");
                console.log(
                  `Use http://localhost:${await this.getPortNumber()}/upload as your storage endpoint`,
                );
                console.log("\x1b[0m");
                return resolve(true);
              })
              .catch((e: any) => {
                return reject(e);
              });
          })
          .catch((e: any) => {
            return reject(e);
          });
      });
    } else {
      console.log("\x1b[32m");
      console.log(
        `Use http://localhost:${await this.getPortNumber()}/upload as your storage endpoint`,
      );
      console.log("\x1b[0m");
    }
  }

  async down() {
    return;
    if (this.getStatus() !== "down") {
      await new Promise(async (resolve, reject) => {
        SpawnHelper.stop(this.getContainerId(), this.callerInstance.getName())
          .then(() => {
            this.setStatus("down");
            this.setContainerId(null);
            return resolve(true);
          })
          .catch((e: any) => {
            return reject(e);
          });
      });
    }
  }

  async build() {
    //
  }

  async getRoutes(): Promise<IRoutes[]> {
    const routes: IRoutes[] = [
      { method: "POST", path: "/upload" },
      { method: "GET", path: "/get/{id}" }
    ];

    return Promise.resolve(routes);
  }
}
