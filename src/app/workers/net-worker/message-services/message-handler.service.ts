import { NetWorkerRequest, NetWorkerResponse } from "src/app/shared/models/net-messages/net-worker-request";
import { ManagementSystem } from "../main/management.service";

export class MessageHandler {

    private mangementSystem: ManagementSystem;

    constructor(protected worker: any) {

        this.mangementSystem = new ManagementSystem(this);
    }

    toClient(message: NetWorkerResponse) {
        this.worker.postMessage(JSON.stringify(message));
    }

    toWorker(message: NetWorkerRequest) {
        this.mangementSystem.handleMessage(message);
    }

}
