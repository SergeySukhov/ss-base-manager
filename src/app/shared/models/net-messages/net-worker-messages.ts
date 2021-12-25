import { BaseWorkerMessage } from "../base-worker-message";
import { AvailableBaseAdditionInfo } from "../server-models/normative-base-info";


export enum NetMessageTypes {
    init,
    getAvailableNormoBases,
    sendFormulsUpload,
    sendNormativesUpload,
    serverTest
}

///////////////////////////////////////////////////////////////////////////

export interface NetWorkerRequestBase<T extends NetMessageTypes> extends BaseWorkerMessage {
  messageType: T,
}

export interface NetWorkerRequestAvailableBases extends NetWorkerRequestBase<NetMessageTypes.getAvailableNormoBases> {
}

export interface NetWorkerRequestUploadFormuls extends NetWorkerRequestBase<NetMessageTypes.sendFormulsUpload> {
  data: {
    file: File,
    addonNumber: number,
    normoGuid: string,
    isAdd?: boolean,
    isDeploy?: boolean
  }
}

export interface NetWorkerRequestUploadNormatives extends NetWorkerRequestBase<NetMessageTypes.sendNormativesUpload> {
  data: {
    fileNormatives: File,
    fileFormuls?: File,
    fileTechs?: File,
    addonNumber: number,
    normoGuid: string,
    addBase?: {
      guid: string;
      name: string,
    },
    isDeploy?: boolean
  }
}

export interface NetWorkerRequestInit extends NetWorkerRequestBase<NetMessageTypes.init> {
}

export type NetWorkerRequest = NetWorkerRequestAvailableBases | NetWorkerRequestInit | NetWorkerRequestUploadFormuls | NetWorkerRequestUploadNormatives;

///////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////

/** Ответное сообщение с воркера */
export interface NetWorkerResponseBase<T extends NetMessageTypes> extends BaseWorkerMessage {
  messageType: T,
}

export interface NetWorkerResponseAvailableBases extends NetWorkerResponseBase<NetMessageTypes.getAvailableNormoBases> {
  data: AvailableBaseAdditionInfo[] | null;
}

export interface NetWorkerResponseUploadFormuls extends NetWorkerResponseBase<NetMessageTypes.sendFormulsUpload> {
}
export interface NetWorkerResponseUploadNormatives extends NetWorkerResponseBase<NetMessageTypes.sendNormativesUpload> {
}
export interface NetWorkerResponseCommon extends NetWorkerResponseBase<NetMessageTypes.init> {
}

export type NetWorkerResponse = NetWorkerResponseAvailableBases | NetWorkerResponseCommon | NetWorkerResponseUploadFormuls | NetWorkerResponseUploadNormatives;

export interface NetData<T extends boolean> {
  isSuccess: T;
}

export interface NetError extends NetData<false> {
  errorDescription: string;
}

export interface NetSuccess extends NetData<true> {
}
