import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { v4 } from "uuid";
import { AuthWorkerRequest, AuthWorkerRequestBase, AuthWorkerResponse } from "../../models/auth-messages/auth-worker-messages";
import { BaseWorkerService } from './base-worker.service';

@Injectable({
    providedIn: 'root',
})
export class AuthWorkerService extends BaseWorkerService<AuthWorkerRequest, AuthWorkerResponse> {

    private responseSubs = new Map<string, Subject<AuthWorkerResponse>>();

    public postMessageToWorker(message: AuthWorkerRequest): Subject<AuthWorkerResponse> {
        if (!this.isInit || !this.worker) {
            throw ("!! Worker was not inited");
        }
        const sub = new Subject<AuthWorkerResponse>();
        if (!message.guid) {
            message.guid = v4();
        }
        this.responseSubs.set(message.guid, sub);
        this.worker.postMessage(message);
        return sub;
    }

    protected handleMessage(message: AuthWorkerResponse) {
        if (!message.guid) {
            throw ("!! AuthWorker message has no id");
        }
        const sub = this.responseSubs.get(message.guid);
        if (sub) {
            sub.next(message);
            sub.unsubscribe();
            this.responseSubs.delete(message.guid);
        } else {
            console.warn("!! AuthWorker Необработанный ответ:" + message);
        }
    }


}

