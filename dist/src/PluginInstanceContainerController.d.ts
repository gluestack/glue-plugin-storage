import IApp from "@gluestack/framework/types/app/interface/IApp";
import IContainerController, { IRoutes } from "@gluestack/framework/types/plugin/interface/IContainerController";
import { PluginInstance } from "./PluginInstance";
export declare class PluginInstanceContainerController implements IContainerController {
    app: IApp;
    status: "up" | "down";
    portNumber: number;
    containerId: string;
    callerInstance: PluginInstance;
    constructor(app: IApp, callerInstance: PluginInstance);
    getFromGlobalEnv(key: string, defaultValue?: string): Promise<any>;
    getCallerInstance(): PluginInstance;
    installScript(): string[];
    runScript(): string[];
    buildScript(): string[];
    getEnv(): Promise<any>;
    getDockerJson(): {};
    getStatus(): "up" | "down";
    getPortNumber(returnDefault?: boolean): Promise<unknown>;
    getContainerId(): string;
    setStatus(status: "up" | "down"): "up" | "down";
    setPortNumber(portNumber: number): number;
    setContainerId(containerId: string): string;
    getConfig(): any;
    up(): Promise<void>;
    down(): Promise<void>;
    build(): Promise<void>;
    getRoutes(): Promise<IRoutes[]>;
}
