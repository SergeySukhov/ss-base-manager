import { Injectable } from "@angular/core";
import { EndpointBaseService } from "src/app/core/services/base-services/endpoint-base.service";
import { NetWorkerService } from "src/app/shared/workers-module/services/net-worker.service";

@Injectable()
export class BaseLogMonitoringEndpointService extends EndpointBaseService {

    constructor(protected netWorker: NetWorkerService) {
        super(netWorker);
    }

}
