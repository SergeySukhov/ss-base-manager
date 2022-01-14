export enum ImoprtanceLevel {
    high,
    low,
}

export enum NotificationType {
    warn,
    error,
    info,
}

export interface NotificationMessage {
    guid: string;
    timeStamp: string;
    fromService: string;
    message: string;
    imoprtance: ImoprtanceLevel,
    type: NotificationType,
    contextId?: string,
}