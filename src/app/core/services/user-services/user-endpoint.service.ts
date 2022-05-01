import { Injectable } from "@angular/core";
import { NetMessageTypes, NWSetUser } from "src/app/shared/models/net-messages/net-worker-messages";
import { NetWorkerService } from "src/app/shared/workers-module/services/net-worker.service";
import { v4 } from "uuid";
import { EndpointBaseService } from "../base-services/endpoint-base.service";

@Injectable()
export class UserEndpointService extends EndpointBaseService {
    constructor(protected netWorker: NetWorkerService) {
        super(netWorker);
    }

    public async sendUser(userName: string, userId: string) {
        const req: NWSetUser = {
            isSub: false,
            messageType: NetMessageTypes.setUser,
            guid: v4(),
            data: {
                userId,
                userName
            }
        } 
        const a = await this.netWorker.postMessageToWorkerAsync(req);
        console.log("!! | sendUser response | a", a)
    }
}