import { Injectable } from "@angular/core";
import { NetMessageTypes } from "src/app/shared/models/net-messages/net-worker-messages";
import { NetWorkerService } from "src/app/shared/workers-module/services/net-worker.service";
import { EndpointBaseService } from "../../../core/services/base-services/endpoint-base.service";
import { IndexBaseResultParams } from "../models/index-base.model";

@Injectable()
export class IndexBaseEndpointService extends EndpointBaseService {

    constructor(protected netWorker: NetWorkerService) {
        super(netWorker);
    }

    public async sendIndecies(finalData: IndexBaseResultParams): Promise<void> {
        if (!finalData.mainFile || !finalData.baseChoice) {
            return;
        }

        const avNB = await this.netWorker.postMessageToWorkerAsync({
            messageType: NetMessageTypes.sendIndeciesUpload,
            isSub: false,
            data: {
                addonNumber: finalData.baseChoice.additionNumber,
                file: finalData.mainFile,
                normoGuid: finalData.baseChoice.guid,
                isAdd: false,
                isDeploy: finalData.needDeploy
            },
        }, false);
    }
}
