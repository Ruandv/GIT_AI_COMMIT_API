import { ICallConfig } from "./call-config.model";

export interface ILoggingRequest {
    message: string,
    level: string
}

export interface ICallRequest {
    prompt: string;
    historyId: string;
    image?: string;
    config?: ICallConfig;
}
