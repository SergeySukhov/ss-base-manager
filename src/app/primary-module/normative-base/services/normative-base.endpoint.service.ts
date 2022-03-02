import { Injectable } from "@angular/core";
import { NetMessageTypes } from "src/app/shared/models/net-messages/net-worker-messages";
import { BaseType } from "src/app/shared/models/server-models/AvailableNormativeBaseType";
import { NormoRequestUploader } from "src/app/shared/models/server-models/server-upload-request-models/NormoRequestUploader";
import { NetWorkerService } from "src/app/shared/workers-module/services/net-worker.service";
import { v4 } from "uuid";
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
        const normoRequest: NormoRequestUploader = {
            AdditionNumber: finalData.addBase?.additionNumber ?? finalData.baseChoice?.additionNumber ?? 1,
            ContextId: "",
            Deploy: finalData.needDeploy,
            AdditionalRegexp: finalData.addBase?.additionRegexp ?? finalData.baseChoice?.additionRegexp ?? "",
            Guid: finalData.addBase?.guid ?? finalData.baseChoice?.guid ?? "",
            IsNewDatabase: !!finalData.addBase,
            IsUpdate: !finalData.addBase,
            Name: finalData.addBase?.name ?? finalData.baseChoice?.name ?? "",
            ShortName: finalData.addBase?.shortName ?? finalData.baseChoice?.shortName ?? "",
            Type: finalData.baseType ?? BaseType.TSN_MGE,
            SourceFile: finalData.mainFile,
            DocumentZipFile: finalData.fileTechDocs,
        };
        const avNB = await this.netWorker.postMessageToWorkerAsync({
            messageType: NetMessageTypes.sendNormativesUpload,
            isSub: false,
            data: normoRequest,
        });

        if (finalData.fileFormuls) {
            const copyNormoReq = JSON.parse(JSON.stringify(normoRequest)) as NormoRequestUploader;
            copyNormoReq.SourceFile = finalData.fileFormuls;
            copyNormoReq.DocumentZipFile = null;
            const avNB = await this.netWorker.postMessageToWorkerAsync({
                messageType: NetMessageTypes.sendFormulsUpload,
                isSub: false,
                data: copyNormoReq
            }, false);
        }
    }
}
