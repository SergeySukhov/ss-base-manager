import { Injectable } from '@angular/core';
import { Subject } from "rxjs";
import { NWSubMessage } from '../../models/net-messages/net-worker-messages';

@Injectable()
export abstract class BaseWorkerService<TRequest, TResponse> {

    protected isInit = false;
    protected worker: Worker | undefined;
    protected timoutResponse = 8000;


    constructor() { }

    public setupWorker(worker: Worker) {
        this.worker = worker;
        this.worker.onmessage = (message) => {
            this.handleMessage(JSON.parse(message.data));
        };
        this.isInit = true;
    }

    public async postMessageToWorkerAsync(workerMessage: TRequest, ignoreTimout = false): Promise<TResponse | null> {
        let sub: Subject<TResponse>;
        let timeout: any = null;
        const promise = new Promise<TResponse | null>((resolve, reject) => {
            if (!ignoreTimout) {
                timeout = setTimeout(() => {
                    console.warn("!! error timeout request", workerMessage);
                    sub.unsubscribe();
                    resolve(null);
                }, this.timoutResponse);
            }
            try {
                sub = this.postMessageToWorker(workerMessage);
                sub.subscribe(response => {
                    sub.unsubscribe();
                    clearTimeout(timeout);
                    resolve(response);
                });
            } catch (error) {
                sub.unsubscribe();
                console.warn("!! error: ", workerMessage);

                clearTimeout(timeout);
                resolve(null);
            }

        });
        return await promise;
    }

    public abstract postMessageToWorker(workerMessage: TRequest): Subject<TResponse>;

    protected abstract handleMessage(message: TResponse): void;
}