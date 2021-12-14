import { AuthWorkerRequest, AuthWorkerResponse } from "src/app/shared/models/auth-messages/auth-worker-messages";
import { ManagementSystem } from "../main/management.service";

export class MessageHandler {

    private mangementSystem: ManagementSystem;

    constructor(protected worker: any) {
        this.mangementSystem = new ManagementSystem(this);
    }

    toClient(message: AuthWorkerResponse) {
        this.worker.postMessage(JSON.stringify(message));
    }

    toWorker(message: AuthWorkerRequest) {
        this.mangementSystem.handleMessage(message);
    }

}
