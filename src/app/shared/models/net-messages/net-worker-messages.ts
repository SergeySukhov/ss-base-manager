import { BaseWorkerMessage } from "../base-worker-message";

export enum NetMessageTypes {
  init,
  serverTest,
}

export interface NetWorkerRequestBase<T extends NetMessageTypes> extends BaseWorkerMessage {
  messageType: T,
}

export interface NetWorkerRequestTest extends NetWorkerRequestBase<NetMessageTypes.serverTest> {
  data: {
   
  }
}

export interface NetWorkerRequestInit extends NetWorkerRequestBase<NetMessageTypes.init> {
}

export type NetWorkerRequest = NetWorkerRequestTest | NetWorkerRequestInit;

/////////////////////////

/** Ответное сообщение с воркера авторизации */
export interface NetWorkerResponseBase<T extends NetMessageTypes> extends BaseWorkerMessage {
  messageType: T,
}

export interface NetWorkerResponseTest extends NetWorkerResponseBase<NetMessageTypes.serverTest> {
  data: any;
}

export interface NetWorkerResponseCommon extends NetWorkerResponseBase<NetMessageTypes.init> {
}

export type NetWorkerResponse = NetWorkerResponseTest | NetWorkerResponseCommon;

export interface NetData<T extends boolean> {
  isSuccess: T;
}

export interface NetError extends NetData<false> {
  errorDescription: string;
}

export interface NetSuccess extends NetData<true> {
  // refreshToken: string;
}
