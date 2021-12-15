import { Injectable } from "@angular/core";
import { EndpointService } from "src/app/core/common/services/endpoint.service";
import { AuthMessageTypes } from "src/app/shared/models/auth-messages/auth-worker-messages";
import { AuthWorkerService } from "src/app/shared/workers-module/services/auth-worker.service";

@Injectable()
export class AuthEndpointService { //  extends EndpointService {
    constructor(private authWorker: AuthWorkerService) {
    }

    public async sendAuth(username: string, password: string) {
        const a = await this.authWorker.postMessageToWorkerAsync({
            messageType: AuthMessageTypes.login,
            data: {
                username,
                password
            },
        })
        console.log("!! | sendAuth | a", a)
    }
}