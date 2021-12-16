import { Injectable } from "@angular/core";
import { AuthMessageTypes, AuthWorkerResponseLogin } from "src/app/shared/models/auth-messages/auth-worker-messages";
import { AuthWorkerService } from "src/app/shared/workers-module/services/auth-worker.service";

@Injectable()
export class AuthEndpointService {
    constructor(private authWorker: AuthWorkerService) {
    }

    public async sendAuth(username: string, password: string): Promise<AuthWorkerResponseLogin | null> {
        const requestAuth = {
            messageType: AuthMessageTypes.login,
            data: {
                username,
                password
            },
        }
        console.log("!! | sendAuth | aa", requestAuth)
        const responseAuth = await this.authWorker.postMessageToWorkerAsync(requestAuth);
        if (responseAuth?.messageType === AuthMessageTypes.login) {
            console.log("!! | sendAuth | a", responseAuth)
            return responseAuth;
        } else {
            throw new Error("!! неверный тип ответа авторизации")
        }
    }
}