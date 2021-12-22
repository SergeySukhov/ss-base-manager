import { Injectable } from "@angular/core";
import { EndpointService } from "src/app/core/services/endpoint.service";
import { NetMessageTypes } from "src/app/shared/models/net-messages/net-worker-messages";
import { NetWorkerService } from "src/app/shared/workers-module/services/net-worker.service";

@Injectable()
export class FormulaBaseEndpointService { //  extends EndpointService {

    constructor(private netWorker: NetWorkerService) {
    }

    public async getAvailableNB(): Promise<string[]> {
        
        // const a = new Promise<string[]>((resolve, reject) => {
        //     setTimeout(() => {
        //         resolve(["1qwe", "2rty"]);
        //     }, 1000);
        // });

        // return a;
        const avNB = await this.netWorker.postMessageToWorkerAsync({
            messageType: NetMessageTypes.serverTest,
            data: {}
        });
        console.log("!! | getAvailableNB | avNB", avNB)

        return [];
    }
}
