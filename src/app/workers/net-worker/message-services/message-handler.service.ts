import { NetWorkerResponse, NetWorkerRequest, NetWorkerSub, NetWorkerRequestSub } from "src/app/shared/models/net-messages/net-worker-messages";
import { ManagementSystem } from "../main/management.service";

export class MessageHandler {

    private mangementSystem: ManagementSystem;

    constructor(protected worker: any) {

        this.mangementSystem = new ManagementSystem(this);
    }

    toClient(message: NetWorkerResponse | NetWorkerSub) {
        this.worker.postMessage(JSON.stringify(message));
    }

    toWorker(message: NetWorkerRequest | NetWorkerRequestSub) {
        this.mangementSystem.handleMessage(message);
    }

}
