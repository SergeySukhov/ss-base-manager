import { Injectable } from "@angular/core";
import { AuthMessageTypes, AuthWorkerRequestLogin, AuthWorkerRequestRefresh, AuthWorkerResponseLogin, AuthWorkerResponseRefresh } from "src/app/shared/models/auth-messages/auth-worker-messages";
import { AuthWorkerService } from "src/app/shared/workers-module/services/auth-worker.service";

@Injectable()
export class AuthEndpointService {
    constructor(private authWorker: AuthWorkerService) {
    }

    public async sendAuth(username: string, password: string): Promise<AuthWorkerResponseLogin | null> {
        const requestAuth: AuthWorkerRequestLogin = {
            messageType: AuthMessageTypes.login,
            data: {
                username,
                password
            },
        }
        const responseAuth = await this.authWorker.postMessageToWorkerAsync(requestAuth);
        if (responseAuth?.messageType === AuthMessageTypes.login) {
            return responseAuth;
        } else {
            throw new Error("!! неверный тип ответа авторизации")
        }
    }

    public async sendAuthRefresh(
        // token: string
        ): Promise<AuthWorkerResponseRefresh | null> {
        const requestRefAuth: AuthWorkerRequestRefresh = {
            messageType: AuthMessageTypes.refresh,
            data: {
                // token
            },
        }
        console.log("!! | sendAuth | requestRefAuth", requestRefAuth)
        const responseAuth = await this.authWorker.postMessageToWorkerAsync(requestRefAuth);
        if (responseAuth?.messageType === AuthMessageTypes.refresh) {
            console.log("!! | sendAuth | requestRefAuth", responseAuth)
            return responseAuth;
        } else {
            throw new Error("!! неверный тип ответа авторизации")
        }
    }
}