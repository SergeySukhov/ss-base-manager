import { Injectable } from "@angular/core";
import { NetMessageTypes } from "src/app/shared/models/net-messages/net-worker-messages";
import { NetWorkerService } from "src/app/shared/workers-module/services/net-worker.service";
import { v4 } from "uuid";
import { EndpointBaseService } from "../../../core/services/base-services/endpoint-base.service";
import { FormulaBaseEndpointService } from "../../formula-base/services/formula-base.endpoint.service";
import { NormBaseResultParams } from "../models/norm-base.models";

@Injectable()
export class NormativeBaseEndpointService extends EndpointBaseService {

    constructor(protected netWorker: NetWorkerService, private formulaUploader: FormulaBaseEndpointService) {
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
                AdditionNumber: finalData.addBase?.additionNumber ?? finalData.baseChoice?.additionNumber ?? 1,
                ContextId: "",
                Deploy: finalData.needDeploy,
                AdditionalRegexp: finalData.addBase?.additionRegexp ?? finalData.baseChoice?.additionRegexp ?? "",
                Guid: finalData.addBase?.guid ?? finalData.baseChoice?.guid ?? "",
                IsNewDatabase: !!finalData.addBase,
                IsUpdate: !!finalData.addBase,
                Name: finalData.addBase?.name ?? finalData.baseChoice?.name ?? "",
                ShortName: finalData.addBase?.shortName ?? finalData.baseChoice?.shortName ?? "",
                Type: finalData.baseType,
                SourceFile: finalData.mainFile,
                DocumentZipFile: finalData.fileTechDocs,
            },
        });
    }
}
