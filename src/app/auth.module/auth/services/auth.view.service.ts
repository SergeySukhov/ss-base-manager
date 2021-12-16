import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AuthEndpointService } from "./auth.endpoint.service";
import { AuthStateService } from "./auth.state.service";

@Injectable()
export class AuthViewService {

    public isAuth = false;

    constructor(private router: Router, private endpoint: AuthEndpointService, private stateService: AuthStateService) {
    }

    public async login(username: string, password: string) {
        const authResponse = await this.endpoint.sendAuth(username, password);
        if (!!authResponse?.data) {
            if (authResponse.data === true) {
                this.isAuth = true;
                this.router.navigate([""]);
                return;
            } else {
                this.stateService.errorMessage = authResponse.data.errorDescription;
            }
        }
        this.isAuth = false;
    }
}