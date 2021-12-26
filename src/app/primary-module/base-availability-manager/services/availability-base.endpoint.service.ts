import { Injectable } from "@angular/core";
import { NetMessageTypes } from "src/app/shared/models/net-messages/net-worker-messages";
import { BaseType, NormativeBaseInfo } from "src/app/shared/models/server-models/normative-base-info";
import { NetWorkerService } from "src/app/shared/workers-module/services/net-worker.service";
import { EndpointBaseService } from "../../models/endpoint-base.service";

@Injectable()
export class AvailabilityBaseEndpointService extends EndpointBaseService {

    constructor(protected netWorker: NetWorkerService) {
        super(netWorker);
    }
}
