import { Injectable } from "@angular/core";
import { NetMessageTypes } from "src/app/shared/models/net-messages/net-worker-messages";
import { NetWorkerService } from "src/app/shared/workers-module/services/net-worker.service";
import { EndpointBaseService } from "../../models/endpoint-base.service";
import { FormBaseResultParams } from "../models/form-base.models";

@Injectable()
export class FormulaBaseEndpointService extends EndpointBaseService {

    constructor(protected netWorker: NetWorkerService) {
        super(netWorker);
    }

    public async sendFormuls(finalData: FormBaseResultParams): Promise<void> {
        if (!finalData.file || !finalData.normBaseChoice) {
            return;
        }

        const avNB = await this.netWorker.postMessageToWorkerAsync({
            messageType: NetMessageTypes.sendFormulsUpload,
            data: {
                addonNumber: finalData.normBaseChoice.additionalNumber,
                file: finalData.file,
                normoGuid: finalData.normBaseChoice.guid,
                isAdd: false,
                isDeploy: finalData.needDeploy
            },
        });
    }
}
