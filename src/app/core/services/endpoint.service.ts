import { Injectable } from "@angular/core";
import { AuthWorkerService } from "src/app/shared/workers-module/services/auth-worker.service";
import { NetWorkerService } from "src/app/shared/workers-module/services/net-worker.service";

@Injectable()
export class EndpointService {

    constructor(private netWorker: NetWorkerService, private authWorker: AuthWorkerService) {
    }

    
}


