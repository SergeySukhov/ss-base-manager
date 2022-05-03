import { Injectable } from "@angular/core";
import { NetMessageTypes } from "src/app/shared/models/net-messages/net-worker-messages";
import { BaseType } from "src/app/shared/models/server-models/AvailableNormativeBaseType";
import { NetWorkerService } from "src/app/shared/workers-module/services/net-worker.service";
import { v4 } from "uuid";
import { EndpointNormoBaseService } from "../../../core/services/base-services/endpoint-normo-base.service";
import { MultipleUploadResultParams } from "../models/multiple-upload-result-params.model";

@Injectable()
export class MultipleUploaderEndpointService extends EndpointNormoBaseService {

    constructor(protected netWorker: NetWorkerService) {
        super(netWorker);
    }

    public async sendToUpload(finalData: MultipleUploadResultParams): Promise<boolean> {
        return true;
    }
       
}
