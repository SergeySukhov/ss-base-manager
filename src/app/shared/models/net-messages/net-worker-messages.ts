import { Subject } from "rxjs";
import { NotificationMessage, NotificationUploadProcessInfo } from "src/app/core/common/models/notification.models";
import { BaseWorkerMessage } from "../base-worker-message";
import { AvailableBaseAdditionInfo } from "../server-models/AvailableBaseAdditionInfo";
import { AvailableBaseIndexInfo, ReleasePeriodType } from "../server-models/AvailableBaseIndexInfo";
import { AvailableNormativeBaseType, BaseType } from "../server-models/AvailableNormativeBaseType";
import { IndicesRequestUploader } from "../server-models/server-upload-request-models/IndeciesRequestUploader";
import { NormoRequestUploader } from "../server-models/server-upload-request-models/NormoRequestUploader";
import { CommonRequestUploader } from "../server-models/server-upload-request-models/UploadRequestsBase";

export enum NetMessageTypes {
  init,
  getAvailableNormoBases,
  getAvailableIndeciesBases,
  getAvailableBaseTypes,
  getUploadProcessInfo,

  managerAddNodes,
  managerRemoveNodes,
  managerEditNodes,

  sendFormulsUpload,
  sendNormativesUpload,
  sendIndeciesUpload,

  setUser,

  serverTest,
}

export enum NetSubTypes {
  notificationSub,
  uploadProcessInfo,
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
  data: IndicesRequestUploader;
}

export interface NWSetUser extends NWRequestBase<NetMessageTypes.setUser> {
  data: { userName: string, userId: string };
}

export interface NWRequestUploadProcess  extends NWRequestBase<NetMessageTypes.getUploadProcessInfo> {
  
}

export interface NWRequestInit extends NWRequestBase<NetMessageTypes.init> {
}

export type NWRequest = NWRequestAvailableBaseTypes | NWRequestAvailableBases | NWRequestAvailableIndeciesBases
  | NWRequestInit | NWRequestUploadFormuls | NWRequestUploadNormatives | NWRequestUploadIndecies
  | NWAddAvailableBases | NWRemoveAvailableBases | NWEditAvailableBases | NWSetUser | NWRequestUploadProcess;
//////////////////////////////////////////////////////////

export interface NWRequestNotificationSub extends NWInitSubBase<NetSubTypes.notificationSub> {
}

export interface NWRequestUploadInfoSub extends NWInitSubBase<NetSubTypes.uploadProcessInfo> {
}

export interface NWRequestCloseAllSubs extends NWInitSubBase<NetSubTypes.closeAllSubs> {
}

export type NWRequestSub = NWRequestNotificationSub | NWRequestUploadInfoSub | NWRequestCloseAllSubs;


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

export interface NWResponseUploadProcess extends NWResponseBase<NetMessageTypes.getUploadProcessInfo> {
  data: { message: NotificationUploadProcessInfo[] | null }
}

export interface NWResponseCommon extends NWResponseBase<NetMessageTypes.init
  | NetMessageTypes.managerAddNodes | NetMessageTypes.managerRemoveNodes | NetMessageTypes.managerEditNodes | NetMessageTypes.setUser> {
}

export type NWResponse = NWResponseAvailableBaseTypes | NWResponseAvailableBases | NWResponseCommon
  | NWResponseUploadFormuls | NWResponseUploadNormatives | NWResponseUploadIndecies | NWResponseUploadProcess
  | NWResponseAvailableIndeciesBases;

// ///////////////////////////////////////////////////////////////////////////////////////////////
export interface NWSubNotificationMessage extends NWSubMessageBase<NetSubTypes.notificationSub> {
  data: { message: NotificationMessage }
}

export interface NWSubUploadProcessInfo extends NWSubMessageBase<NetSubTypes.uploadProcessInfo> {
  data: { message: NotificationUploadProcessInfo | null }
}

export interface NWSubCommonResponse extends NWSubMessageBase<NetSubTypes.closeAllSubs> {
}
export type NWSubMessage = NWSubNotificationMessage | NWSubUploadProcessInfo | NWSubCommonResponse;
