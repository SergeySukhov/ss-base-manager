import { Injectable } from "@angular/core";
import { NetWorkerService } from "src/app/shared/workers-module/services/net-worker.service";

@Injectable()
export abstract class EndpointBaseService {
    constructor(protected netWorker: NetWorkerService) {
    }
}