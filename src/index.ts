//@ts-ignore
import packageJSON from "../package.json";
import { PluginInstance } from "./PluginInstance";
import IApp from "@gluestack/framework/types/app/interface/IApp";
import IPlugin from "@gluestack/framework/types/plugin/interface/IPlugin";
import IInstance from "@gluestack/framework/types/plugin/interface/IInstance";
import ILifeCycle from "@gluestack/framework/types/plugin/interface/ILifeCycle";
import IManagesInstances from "@gluestack/framework/types/plugin/interface/IManagesInstances";
import IHasContainerController from "@gluestack/framework/types/plugin/interface/IHasContainerController";
import IGlueStorePlugin from "@gluestack/framework/types/store/interface/IGluePluginStore";
import { attachMinioInstance } from "./attachMinioInstance";
import { PluginInstance as GraphqlPluginInstance } from "@gluestack/glue-plugin-graphql/src/PluginInstance";
import { PluginInstance as MinioPluginInstance } from "@gluestack/glue-plugin-minio/src/PluginInstance";
import { attachGraphqlInstance } from "./attachGraphqlInstance";
import reWriteFile from "./helpers/reWriteFile";
import { updateWorkspaces } from "./helpers/update-workspaces";

//Do not edit the name of this class
export class GlueStackPlugin implements IPlugin, IManagesInstances, ILifeCycle {
  app: IApp;
  instances: (IInstance & IHasContainerController)[];
  type: "stateless" | "stateful" | "devonly" = "stateless";
  gluePluginStore: IGlueStorePlugin;

  constructor(app: IApp, gluePluginStore: IGlueStorePlugin) {
    this.app = app;
    this.instances = [];
    this.gluePluginStore = gluePluginStore;
  }

  init() {
    //
  }

  destroy() {
    //
  }

  getName(): string {
    return packageJSON.name;
  }

  getVersion(): string {
    return packageJSON.version;
  }

  getType(): "stateless" | "stateful" | "devonly" {
    return this.type;
  }

  getTemplateFolderPath(): string {
    return `${process.cwd()}/node_modules/${this.getName()}/template`;
  }

  getMigrationFolderPath(): string {
    return `${process.cwd()}/node_modules/${this.getName()}/hasura/migrations`;
  }

  getInstallationPath(target: string): string {
    return `./backend/services/${target}`;
  }

  async runPostInstall(instanceName: string, target: string) {
    await this.checkAlreadyInstalled();
    if (instanceName !== "storage") {
      console.log("\x1b[36m");
      console.log(
        `Install storage instance: \`node glue add storage storage\``,
      );
      console.log("\x1b[31m");
      throw new Error(
        "storage supports instance name `storage` only",
      );
    }

    const minioInstances = await this.getMinioInstances(instanceName);
    const graphqlInstances = await this.getGraphqlInstances();

    const storageInstance: PluginInstance = await this.app.createPluginInstance(
      this,
      instanceName,
      this.getTemplateFolderPath(),
      target,
    );

    if (storageInstance) {
      await attachMinioInstance(storageInstance, minioInstances);
      await attachGraphqlInstance(storageInstance, graphqlInstances);

      // update package.json'S name index with the new instance name
      const pluginPackage = `${storageInstance.getInstallationPath()}/package.json`;
      await reWriteFile(pluginPackage, instanceName, 'INSTANCENAME');

      // update root package.json's workspaces with the new instance name
      const rootPackage = `${process.cwd()}/package.json`;
      await updateWorkspaces(rootPackage, storageInstance.getInstallationPath());
    }
  }

  async checkAlreadyInstalled() {
    const storagePlugin: GlueStackPlugin = this.app.getPluginByName(
      "@gluestack/glue-plugin-storage",
    );
    //Validation
    if (storagePlugin?.getInstances()?.[0]) {
      throw new Error(
        `storage instance already installed as ${storagePlugin
          .getInstances()[0]
          .getName()}`,
      );
    }
  }

  createInstance(
    key: string,
    gluePluginStore: IGlueStorePlugin,
    installationPath: string,
  ): IInstance {
    const instance = new PluginInstance(
      this.app,
      this,
      key,
      gluePluginStore,
      installationPath,
    );
    this.instances.push(instance);
    return instance;
  }

  getInstances(): (IInstance & IHasContainerController)[] {
    return this.instances;
  }

  async getGraphqlInstances(): Promise<GraphqlPluginInstance[]> {
    const graphqlPlugin: GlueStackPlugin = this.app.getPluginByName(
      "@gluestack/glue-plugin-graphql",
    );
    //Validation
    if (!graphqlPlugin || !graphqlPlugin.getInstances().length) {
      console.log("\x1b[36m");
      console.log(
        `Install graphql instance: \`node glue add graphql graphql-backend\``,
      );
      console.log("\x1b[31m");
      throw new Error(
        "Graphql instance not installed from `@gluestack/glue-plugin-graphql`",
      );
    }
    const graphqlInstances: GraphqlPluginInstance[] = [];
    graphqlPlugin
      .getInstances()
      .forEach((graphqlInstance: GraphqlPluginInstance) => {
        if (!graphqlInstance.gluePluginStore.get("storage_instance")) {
          graphqlInstances.push(graphqlInstance);
        }
      });
    if (!graphqlInstances.length) {
      throw new Error(
        "There is no graphql instance where storage plugin can be installed",
      );
    }
    return graphqlInstances;
  }

  async getMinioInstances(
    instanceName: string,
  ): Promise<MinioPluginInstance[]> {
    const minioPlugin: GlueStackPlugin = this.app.getPluginByName(
      "@gluestack/glue-plugin-minio",
    );
    //Validation
    if (!minioPlugin || !minioPlugin.getInstances().length) {
      console.log("\x1b[36m");
      console.log(
        `Install minio instance: \`node glue add minio ${instanceName}-minio\``,
      );
      console.log("\x1b[31m");
      throw new Error(
        "Minio instance not installed from `@gluestack/glue-plugin-minio`",
      );
    }
    //@ts-ignore
    return minioPlugin.getInstances();
  }
}
