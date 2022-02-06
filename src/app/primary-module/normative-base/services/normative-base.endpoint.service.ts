import { Injectable } from "@angular/core";
import { NetMessageTypes } from "src/app/shared/models/net-messages/net-worker-messages";
import { NetWorkerService } from "src/app/shared/workers-module/services/net-worker.service";
import { EndpointBaseService } from "../../../core/services/base-services/endpoint-base.service";
import { NormBaseResultParams } from "../models/norm-base.models";

@Injectable()
export class NormativeBaseEndpointService extends EndpointBaseService {

    constructor(protected netWorker: NetWorkerService) {
        super(netWorker);
    }

    public async sendNormatives(finalData: NormBaseResultParams): Promise<void> {
        if (!finalData.mainFile) {
            return;
        }

        const avNB = await this.netWorker.postMessageToWorkerAsync({
            messageType: NetMessageTypes.sendNormativesUpload,
            isSub: false,
            data: {
                additionNumber: finalData.baseChoice?.additionNumber ?? 11,
                fileNormatives: finalData.mainFile,
                normoGuid: finalData.addBase?.guid ?? finalData.baseChoice?.guid ?? "",
                isDeploy: finalData.needDeploy,
                baseType: finalData.baseType,
                addBase: finalData.addBase ? {
                    guid: finalData.addBase.guid,
                    name: "",
                } : undefined,
            },
        });
    }
}
