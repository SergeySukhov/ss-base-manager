import { BaseWorkerMessage } from "../base-worker-message";
import { AvailableBaseAdditionInfo } from "../server-models/normative-base-info";


export enum NetMessageTypes {
    init,
    getAvailableNormoBases,
    sendFormulsUpload,
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
  }
}

export interface NetWorkerRequestInit extends NetWorkerRequestBase<NetMessageTypes.init> {
}

export type NetWorkerRequest = NetWorkerRequestAvailableBases | NetWorkerRequestInit | NetWorkerRequestUploadFormuls;

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

export interface NetWorkerResponseCommon extends NetWorkerResponseBase<NetMessageTypes.init> {
}

export type NetWorkerResponse = NetWorkerResponseAvailableBases | NetWorkerResponseCommon | NetWorkerResponseUploadFormuls;

export interface NetData<T extends boolean> {
  isSuccess: T;
}

export interface NetError extends NetData<false> {
  errorDescription: string;
}

export interface NetSuccess extends NetData<true> {
}
