
export interface BaseWorkerMessage {
    guid?: string;
    data?: any;
    isSub: boolean;
}