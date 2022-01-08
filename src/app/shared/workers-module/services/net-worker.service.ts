import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { v4 } from "uuid";
import { NetSubTypes, NetWorkerRequest, NetWorkerRequestSub, NetWorkerResponse, NetWorkerSub } from "../../models/net-messages/net-worker-messages";
import { BaseWorkerService } from './base-worker.service';

@Injectable({
    providedIn: 'root',
})
export class NetWorkerService extends BaseWorkerService<NetWorkerRequest, NetWorkerResponse> {

    private responseSubs = new Map<string, Subject<NetWorkerResponse>>();
    private subSubs = new Map<string, Subject<NetWorkerSub>>();

    public postMessageToWorker(message: NetWorkerRequest): Subject<NetWorkerResponse> {
        if (!this.isInit || !this.worker) {
            throw ("!! Worker was not inited");
        }
        const sub = new Subject<NetWorkerResponse>();
        if (!message.guid) {
            message.guid = v4();
        }
        this.responseSubs.set(message.guid, sub);
        this.worker.postMessage(message);
        return sub;
    }

    public initSub(message: NetWorkerRequestSub): Subject<NetWorkerSub> {
        if (!this.isInit || !this.worker) {
            throw ("!! Worker was not inited");
        }
        const sub = new Subject<NetWorkerSub>();
        if (!message.guid) {
            message.guid = v4();
        }
        this.subSubs.set(message.guid, sub);
        this.worker.postMessage(message);
        return sub;
    }

    protected handleMessage(message: NetWorkerResponse | NetWorkerSub) {
        if (!message.guid) {
            throw ("!! Worker message has no id");
        }
        if (message.needSub) {
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
                console.warn("!! Необработанный ответ:" + message);
            }
            
        }
    }
}
