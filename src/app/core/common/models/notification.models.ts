export enum ImoprtanceLevel {
    high,
    low,
}

export enum NotificationType {
    warn,
    error,
    info,
}

export enum UploadProcessState {
    inited,
    processing,
    deploying,
    error,
    success,
}

export interface NotificationMessage {
    guid: string;
    timeStamp?: string;
    fromService: string;
    message: string;
    extraMessage?: string;
    imoprtance: ImoprtanceLevel,
    type: NotificationType,
    contextId?: string,
}

export interface NotificationUploadProcessInfo {
    requestGuid: string;
    baseName: string;
    description: string;
    state: UploadProcessState;
    creationTime: string;
    lastUpdateTime: string;
}