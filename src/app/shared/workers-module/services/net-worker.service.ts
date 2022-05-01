import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { v4 } from "uuid";
import { NWRequest, NWRequestSub, NWResponse, NWSubMessage } from "../../models/net-messages/net-worker-messages";
import { BaseWorkerService } from './base-worker.service';

@Injectable({
    providedIn: 'root',
})
export class NetWorkerService extends BaseWorkerService<NWRequest, NWResponse> {

    private responseSubs = new Map<string, Subject<NWResponse>>();
    private subSubs = new Map<string, Subject<NWSubMessage>>();


    public postMessageToWorker(message: NWRequest): Subject<NWResponse> {
        if (!this.isInit || !this.worker) {
            throw ("!! Worker was not inited");
        }
        const sub = new Subject<NWResponse>();
        if (!message.guid) {
            message.guid = v4();
        }
        this.responseSubs.set(message.guid, sub);
        this.worker.postMessage(message);
        return sub;
    }

    public requestSub(message: NWRequestSub): Subject<NWSubMessage> {
        if (!this.isInit || !this.worker) {
            throw ("!! Worker was not inited");
        }
        const sub = new Subject<NWSubMessage>();
        if (!message.guid) {
            message.guid = v4();
        }
        this.subSubs.set(message.guid, sub);
        this.worker.postMessage(message);
        return sub;
    }

    protected handleMessage(message: NWResponse | NWSubMessage) {
        if (!message.guid) {
            throw ("!! Worker message has no id");
        }
        if (message.isSub) {
            const sub = this.subSubs.get(message.guid);
            if (sub) {
                sub.next(message);
            }
        } else {
            const sub = this.responseSubs.get(message.guid);
            if (sub) {
                sub.next(message);
                sub.unsubscribe();
                this.responseSubs.delete(message.guid);
            } else {
                console.warn("!! Необработанный ответ:", message);
            }
            
        }
    }
}
