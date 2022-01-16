import { NWResponse, NWRequest, NWSubMessage, NWRequestSub } from "src/app/shared/models/net-messages/net-worker-messages";
import { ManagementSystem } from "../main/management.service";

export class MessageHandler {

    private mangementSystem: ManagementSystem;

    constructor(protected worker: any) {

        this.mangementSystem = new ManagementSystem(this);
    }

    toClient(message: NWResponse | NWSubMessage) {
        this.worker.postMessage(JSON.stringify(message));
    }

    toWorker(message: NWRequest | NWRequestSub) {
        this.mangementSystem.handleMessage(message);
    }

}
