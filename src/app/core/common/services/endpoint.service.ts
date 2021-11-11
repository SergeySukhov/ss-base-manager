import { Injectable } from "@angular/core";
import { UUID } from "angular2-uuid";
import { NetWorkerRequest, NetMessageTypes } from "src/app/shared/models/net-messages/net-worker-request";
import { NetWorkerService } from "src/app/shared/workers-module/services/net-worker.service";
import { ServerRequestTimeout } from "../models/consts";
import { UserState } from "../models/enums";
import { UserData } from "../models/models";

@Injectable()
export class EndpointService {

    constructor(private netWorker: NetWorkerService) { }
}


