import { Injectable } from '@angular/core';
import { Subject } from "rxjs";

@Injectable()
export abstract class BaseWorkerService<TRequest, TResponse> {

    protected isInit = false;
    protected worker: Worker | undefined;
    protected timoutResponse = 5000;

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
        const promise = new Promise<TResponse | null>((resolve, reject) => {
            try {
                sub = this.postMessageToWorker(workerMessage);
                sub.subscribe(response => {
                    sub.unsubscribe();
                    resolve(response)
                });
            } catch (error) {
                reject(error);
            }
            // if (!ignoreTimout) {
            //     console.warn("!! error timeout request", workerMessage);
            //     setTimeout(() => {
            //         reject(null);
            //     }, this.timoutResponse);
            // }
        });
        return await promise;
    }

    public abstract postMessageToWorker(workerMessage: TRequest): Subject<TResponse>;

    protected abstract handleMessage(message: TResponse): void;
}