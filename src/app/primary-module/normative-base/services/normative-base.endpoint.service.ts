import { Injectable } from "@angular/core";
import { EndpointService } from "src/app/core/common/services/endpoint.service";
import { AuthMessageTypes } from "src/app/shared/models/auth-messages/auth-worker-messages";
import { AuthWorkerService } from "src/app/shared/workers-module/services/auth-worker.service";

@Injectable()
export class NormativeBaseEndpointService { //  extends EndpointService {

    constructor(private authWorker: AuthWorkerService) {
    }

    public async testGetData(): Promise<string[]> {
        
        const a = new Promise<string[]>((resolve, reject) => {
            setTimeout(() => {
                resolve(["1qwe", "2rty"]);
            }, 1000);
        });

        return a;
    }

    public async testAuth() {
        const a = await this.authWorker.postMessageToWorkerAsync({
            messageType: AuthMessageTypes.login,
            data: {
                username: "sergey.suhov@smeta.ru",
                password: "109901sekret"
            },
        })
        console.log("!! | testAuth | a", a)
    }
}
