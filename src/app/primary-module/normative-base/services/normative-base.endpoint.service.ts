import { Injectable } from "@angular/core";
import { EndpointService } from "src/app/core/common/services/endpoint.service";
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

    public testAuth() {
        this.authWorker.postMessageToWorker({
            data: {
                username: "sergey.suhov@smeta.ru",
                password: "109901sekret"
            },
            
        })
    }
}
