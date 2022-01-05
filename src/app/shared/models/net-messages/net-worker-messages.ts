import { BaseWorkerMessage } from "../base-worker-message";
import { AvailableBaseAdditionInfo } from "../server-models/AvailableBaseAdditionInfo";
import { AvailableNormativeBaseType, BaseType } from "../server-models/AvailableNormativeBaseType";


export enum NetMessageTypes {
  init,
  getAvailableNormoBases,
  getAvailableBaseTypes,

  managerAddNodes,
  managerRemoveNodes,
  managerEditNodes,

  sendFormulsUpload,
  sendNormativesUpload,

  serverTest
}

///////////////////////////////////////////////////////////////////////////

export interface NetWorkerRequestBase<T extends NetMessageTypes> extends BaseWorkerMessage {
  messageType: T,
}

export interface NetWorkerRequestAvailableBaseTypes extends NetWorkerRequestBase<NetMessageTypes.getAvailableBaseTypes> {
}
export interface NetWorkerRequestAvailableBases extends NetWorkerRequestBase<NetMessageTypes.getAvailableNormoBases> {
  data: { type: BaseType },
}

export interface NetWorkerAddAvailableBases extends NetWorkerRequestBase<NetMessageTypes.managerAddNodes> {
  data: { rootNodes: AvailableNormativeBaseType[] },
}
export interface NetWorkerRemoveAvailableBases extends NetWorkerRequestBase<NetMessageTypes.managerRemoveNodes> {
  data: { guids: string[] },
}
export interface NetWorkerEditAvailableBases extends NetWorkerRequestBase<NetMessageTypes.managerEditNodes> {
  data: { rootNodes: AvailableNormativeBaseType[], normoNodes: AvailableBaseAdditionInfo[] },
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

export type NetWorkerRequest = NetWorkerRequestAvailableBaseTypes | NetWorkerRequestAvailableBases
  | NetWorkerRequestInit | NetWorkerRequestUploadFormuls | NetWorkerRequestUploadNormatives
  | NetWorkerAddAvailableBases | NetWorkerRemoveAvailableBases | NetWorkerEditAvailableBases;

///////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////

/** Ответное сообщение с воркера */
export interface NetWorkerResponseBase<T extends NetMessageTypes> extends BaseWorkerMessage {
  messageType: T,
}

export interface NetWorkerResponseAvailableBaseTypes extends NetWorkerResponseBase<NetMessageTypes.getAvailableBaseTypes> {
  data: AvailableNormativeBaseType[] | null;
}
export interface NetWorkerResponseAvailableBases extends NetWorkerResponseBase<NetMessageTypes.getAvailableNormoBases> {
  data: AvailableBaseAdditionInfo[] | null;
}
export interface NetWorkerResponseUploadFormuls extends NetWorkerResponseBase<NetMessageTypes.sendFormulsUpload> {
}
export interface NetWorkerResponseUploadNormatives extends NetWorkerResponseBase<NetMessageTypes.sendNormativesUpload> {
}
export interface NetWorkerResponseCommon extends NetWorkerResponseBase<NetMessageTypes.init 
  | NetMessageTypes.managerAddNodes | NetMessageTypes.managerRemoveNodes | NetMessageTypes.managerEditNodes> {
}

export type NetWorkerResponse = NetWorkerResponseAvailableBaseTypes | NetWorkerResponseAvailableBases | NetWorkerResponseCommon
  | NetWorkerResponseUploadFormuls | NetWorkerResponseUploadNormatives;

export interface NetData<T extends boolean> {
  isSuccess: T;
}

export interface NetError extends NetData<false> {
  errorDescription: string;
}

export interface NetSuccess extends NetData<true> {
}
