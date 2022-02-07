import { Injectable } from "@angular/core";
import { NetMessageTypes } from "src/app/shared/models/net-messages/net-worker-messages";
import { IndicesRequestUploader } from "src/app/shared/models/server-models/server-upload-request-models/IndeciesRequestUploader";
import { NetWorkerService } from "src/app/shared/workers-module/services/net-worker.service";
import { EndpointBaseService } from "../../../core/services/base-services/endpoint-base.service";
import { IndexBaseResultParams } from "../models/index-base.model";

@Injectable()
export class IndexBaseEndpointService extends EndpointBaseService {

    constructor(protected netWorker: NetWorkerService) {
        super(netWorker);
    }

    public async sendIndecies(finalData: IndexBaseResultParams): Promise<void> {
        if (!finalData.mainFile) {
            return;
        }
        const normoRequest: IndicesRequestUploader = {
            AdditionNumber: finalData.addBase?.additionNumber ?? finalData.baseChoice?.additionNumber ?? 1,
            ContextId: "",
            Deploy: finalData.needDeploy,
            Guid: finalData.addBase?.guid ?? finalData.baseChoice?.guid ?? "",
            IsNewDatabase: !!finalData.addBase,
            Type: finalData.baseType,
            SourceFile: finalData.mainFile,
            DocumentZipFile: finalData.fileTechDocs,
            Month: finalData.addBase?.releasePeriodValue ?? finalData.baseChoice?.releasePeriodValue ?? 0,
            PeriodType: finalData.addBase?.releasePeriodType ?? finalData.baseChoice?.releasePeriodType ?? 0,
            Year: finalData.addBase?.year ?? finalData.baseChoice?.year ?? 0,
            Profit: finalData.sp,
            Overhead: finalData.sp,
            AdditionNormativeGuid: "",

        };
        const avNB = await this.netWorker.postMessageToWorkerAsync({
            messageType: NetMessageTypes.sendIndeciesUpload,
            isSub: false,
            data: normoRequest
        }, false);
    }
}
