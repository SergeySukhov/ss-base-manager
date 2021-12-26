import { Injectable } from "@angular/core";
import { NetMessageTypes } from "src/app/shared/models/net-messages/net-worker-messages";
import { NetWorkerService } from "src/app/shared/workers-module/services/net-worker.service";
import { EndpointBaseService } from "../../models/endpoint-base.service";
import { NormBaseResultParams } from "../models/norm-base.models";

@Injectable()
export class NormativeBaseEndpointService extends EndpointBaseService {

    constructor(protected netWorker: NetWorkerService) {
        super(netWorker);
    }

    public async sendNormatives(finalData: NormBaseResultParams): Promise<void> {
        if (!finalData.fileNormatives) {
            return;
        }

        const avNB = await this.netWorker.postMessageToWorkerAsync({
            messageType: NetMessageTypes.sendNormativesUpload,
            data: {
                addonNumber: finalData.normBaseChoice?.additionalNumber ?? 11,
                fileNormatives: finalData.fileNormatives,
                normoGuid: finalData.addBase?.guid ?? finalData.normBaseChoice?.guid ?? "",
                isDeploy: finalData.needDeploy
            },
        });
    }
}
