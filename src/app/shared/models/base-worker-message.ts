
export interface BaseWorkerMessage {
    guid?: string;
    data?: any;
    needSub: boolean;
}