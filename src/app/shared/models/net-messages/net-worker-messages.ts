﻿import { Subject } from "rxjs";
import { NotificationMessage } from "src/app/core/common/models/notification.models";
import { BaseWorkerMessage } from "../base-worker-message";
import { AvailableBaseAdditionInfo } from "../server-models/AvailableBaseAdditionInfo";
import { AvailableBaseIndexInfo, ReleasePeriodType } from "../server-models/AvailableBaseIndexInfo";
import { AvailableNormativeBaseType, BaseType } from "../server-models/AvailableNormativeBaseType";
import { NormoRequestUploader } from "../server-models/server-upload-request-models/NormoRequestUploader";
import { CommonRequestUploader } from "../server-models/server-upload-request-models/UploadRequestsBase";

export enum NetMessageTypes {
  init,
  getAvailableNormoBases,
  getAvailableIndeciesBases,
  getAvailableBaseTypes,

  managerAddNodes,
  managerRemoveNodes,
  managerEditNodes,

  sendFormulsUpload,
  sendNormativesUpload,
  sendIndeciesUpload,

  serverTest,
}

export enum NetSubTypes {
  notificationSub,
  closeAllSubs,

}

///////////////////////////////////////////////////////////////////////////

export interface NWRequestBase<T extends NetMessageTypes> extends BaseWorkerMessage {
  messageType: T,
}

export interface NWInitSubBase<T extends NetSubTypes> extends BaseWorkerMessage {
  messageType: T,
}
// ///////////////////////////////////////////////////////////////////////////////////////////////

export interface NWRequestAvailableBaseTypes extends NWRequestBase<NetMessageTypes.getAvailableBaseTypes> {
}
export interface NWRequestAvailableBases extends NWRequestBase<NetMessageTypes.getAvailableNormoBases> {
  data: { type: BaseType },
}
export interface NWRequestAvailableIndeciesBases extends NWRequestBase<NetMessageTypes.getAvailableIndeciesBases> {
  data: { type: BaseType },
}

export interface NWAddAvailableBases extends NWRequestBase<NetMessageTypes.managerAddNodes> {
  data: { rootNodes: AvailableNormativeBaseType[] },
}
export interface NWRemoveAvailableBases extends NWRequestBase<NetMessageTypes.managerRemoveNodes> {
  data: { guids: string[] },
}
export interface NWEditAvailableBases extends NWRequestBase<NetMessageTypes.managerEditNodes> {
  data: {
    rootNodes?: AvailableNormativeBaseType[],
    normoNodes?: AvailableBaseAdditionInfo[],
    indexNodes?: AvailableBaseIndexInfo[],
  },
}

export interface NWRequestUploadFormuls extends NWRequestBase<NetMessageTypes.sendFormulsUpload> {
  data: CommonRequestUploader
}

export interface NWRequestUploadNormatives extends NWRequestBase<NetMessageTypes.sendNormativesUpload> {
  data: NormoRequestUploader;
}

export interface NWRequestUploadIndecies extends NWRequestBase<NetMessageTypes.sendIndeciesUpload> {
  data: {
    file: File,
    additionNumber: number,
    year: number;
    periodType: ReleasePeriodType;
    periodValue: number;
    overhead: number;
    profit: number;
    addBase?: {
      guid: string;
    },
    isDeploy?: boolean
    baseType: BaseType;
  }
}


export interface NWRequestInit extends NWRequestBase<NetMessageTypes.init> {
}

export type NWRequest = NWRequestAvailableBaseTypes | NWRequestAvailableBases | NWRequestAvailableIndeciesBases
  | NWRequestInit | NWRequestUploadFormuls | NWRequestUploadNormatives | NWRequestUploadIndecies
  | NWAddAvailableBases | NWRemoveAvailableBases | NWEditAvailableBases;
//////////////////////////////////////////////////////////

export interface NWRequestNotificationSub extends NWInitSubBase<NetSubTypes.notificationSub> {
}

export interface NWRequestCloseAllSubs extends NWInitSubBase<NetSubTypes.closeAllSubs> {
}

export type NWRequestSub = NWRequestNotificationSub | NWRequestCloseAllSubs;


///////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////

/** Ответное сообщение с воркера */
export interface NWResponseBase<T extends NetMessageTypes> extends BaseWorkerMessage {
  messageType: T,
  isSub: false,

}
export interface NWSubMessageBase<T extends NetSubTypes> extends BaseWorkerMessage {
  messageType: T,
  isSub: true,
}

// ///////////////////////////////////////////////////////////////////////////////////////////////

export interface NWResponseAvailableBaseTypes extends NWResponseBase<NetMessageTypes.getAvailableBaseTypes> {
  data: AvailableNormativeBaseType[] | null;
}

export interface NWResponseAvailableBases extends NWResponseBase<NetMessageTypes.getAvailableNormoBases> {
  data: AvailableBaseAdditionInfo[] | null;
}

export interface NWResponseAvailableIndeciesBases extends NWResponseBase<NetMessageTypes.getAvailableIndeciesBases> {
  data: AvailableBaseIndexInfo[] | null;
}

export interface NWResponseUploadFormuls extends NWResponseBase<NetMessageTypes.sendFormulsUpload> {
}

export interface NWResponseUploadNormatives extends NWResponseBase<NetMessageTypes.sendNormativesUpload> {
}

export interface NWResponseUploadIndecies extends NWResponseBase<NetMessageTypes.sendIndeciesUpload> {
}

export interface NWResponseCommon extends NWResponseBase<NetMessageTypes.init
  | NetMessageTypes.managerAddNodes | NetMessageTypes.managerRemoveNodes | NetMessageTypes.managerEditNodes> {
}

export type NWResponse = NWResponseAvailableBaseTypes | NWResponseAvailableBases | NWResponseCommon
  | NWResponseUploadFormuls | NWResponseUploadNormatives | NWResponseUploadIndecies
  | NWResponseAvailableIndeciesBases;

// ///////////////////////////////////////////////////////////////////////////////////////////////
export interface NWSubNotificationMessage extends NWSubMessageBase<NetSubTypes.notificationSub> {
  data: { message: NotificationMessage }
}

export interface NWSubCommonResponse extends NWSubMessageBase<NetSubTypes.closeAllSubs> {
}
export type NWSubMessage = NWSubNotificationMessage | NWSubCommonResponse;
