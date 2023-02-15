const prompts = require("prompts");
import { PluginInstance } from "./PluginInstance";
import IInstance from "@gluestack/framework/types/plugin/interface/IInstance";
import { PluginInstance as GraphqlPluginInstance } from "@gluestack/glue-plugin-graphql/src/PluginInstance";

import { writeEnv } from "./helpers/writeEnv";
import { copyToGraphql } from "./helpers/copyToGraphql";
import reWriteFile from "./helpers/reWriteFile";
const { removeSpecialChars } = require("@gluestack/helpers");

export const setGraphqlConfig = async (
  storageInstance: PluginInstance,
  graphqlInstance: GraphqlPluginInstance,
) => {
  storageInstance.gluePluginStore.set(
    "graphql_instance",
    graphqlInstance.getName(),
  );
  graphqlInstance.gluePluginStore.set(
    "storage_instance",
    storageInstance.getName(),
  );
  return storageInstance.gluePluginStore.get("graphql_instance");
};

async function selectGraphqlInstance(graphqlInstances: IInstance[]) {
  const choices = graphqlInstances.map((graphqlInstance: PluginInstance) => {
    return {
      title: `${graphqlInstance.getName()}`,
      description: `Will attach graphql "${graphqlInstance.getName()}"`,
      value: graphqlInstance,
    };
  });
  const { value } = await prompts({
    type: "select",
    name: "value",
    message: "Select a graphql instance",
    choices: choices,
  });

  return value;
}

export async function attachGraphqlInstance(
  storageInstance: PluginInstance,
  graphqlInstances: GraphqlPluginInstance[],
) {
  const graphqlInstance: GraphqlPluginInstance = await selectGraphqlInstance(
    graphqlInstances,
  );
  if (graphqlInstance) {
    await setGraphqlConfig(storageInstance, graphqlInstance);

    await writeEnv(storageInstance, graphqlInstance);

    await copyToGraphql(storageInstance, graphqlInstance);

    const routerFilePath = `${storageInstance.getInstallationPath()}/router.js`;
    await reWriteFile(
      routerFilePath,
      removeSpecialChars(storageInstance.getName()),
      "services",
    );
  }
}
