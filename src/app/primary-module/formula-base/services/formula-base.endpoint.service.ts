import { Injectable } from "@angular/core";
import { NetMessageTypes } from "src/app/shared/models/net-messages/net-worker-messages";
import { BaseType } from "src/app/shared/models/server-models/AvailableNormativeBaseType";
import { NetWorkerService } from "src/app/shared/workers-module/services/net-worker.service";
import { EndpointNormoBaseService } from "../../../core/services/base-services/endpoint-normo-base.service";
import { FormBaseResultParams } from "../models/form-base.models";

@Injectable()
export class FormulaBaseEndpointService extends EndpointNormoBaseService {

    constructor(protected netWorker: NetWorkerService) {
        super(netWorker);
    }

    public async sendFormuls(finalData: FormBaseResultParams): Promise<boolean> {
        if (!finalData.mainFile || !finalData.baseChoice) {
            return false;
        }

        const avNB = await this.netWorker.postMessageToWorkerAsync({
            messageType: NetMessageTypes.sendFormulsUpload,
            isSub: false,
            data: {
                AdditionNumber: finalData.baseChoice.additionNumber,
                UserId: "",
                Deploy: finalData.needDeploy,
                Guid: finalData.baseChoice.guid,
                IsNewDatabase: false,
                Type: finalData.baseType ?? BaseType.TSN_MGE,
                SourceFile: finalData.mainFile,
                DocumentZipFile: null,
            },
        }, false);
        return !!avNB;
    }
}
