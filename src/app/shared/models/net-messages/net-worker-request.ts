import { BaseWorkerMessage } from "../base-worker-message";

export enum NetMessageTypes {
    init,
    serverTest,
}

export interface NetWorkerRequest extends BaseWorkerMessage {
    messageType: NetMessageTypes;
}

export interface NetWorkerResponse extends BaseWorkerMessage {
    messageType: NetMessageTypes;
    isError: boolean;
}