import { Injectable } from "@angular/core";
import { EndpointService } from "src/app/core/common/services/endpoint.service";
import { AuthMessageTypes } from "src/app/shared/models/auth-messages/auth-worker-messages";
import { AuthWorkerService } from "src/app/shared/workers-module/services/auth-worker.service";
import { AuthEndpointService } from "./auth.endpoint.service";

@Injectable()
export class AuthViewService {
    // constructor(private endpoint: AuthEndpointService) {
    // }
  
    // login(username: string, password: string) {
    //     this.endpoint.sendAuth(username, password);
    // }
}