import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AuthEndpointService } from "./auth.endpoint.service";
import { AuthStateService } from "./auth.state.service";

@Injectable()
export class AuthViewService {

    public isAuth = false;

    constructor(private router: Router, private endpoint: AuthEndpointService, private stateService: AuthStateService) {
        const lastAuthTimeJSON = localStorage.getItem("lastTokenTime");
        const lastAuthTokenJSON = localStorage.getItem("lastToken");
        if (!lastAuthTimeJSON || !lastAuthTokenJSON) {
            return;
        }

        const lastAuthTime = JSON.parse(lastAuthTimeJSON);
        const lastAuthToken = JSON.parse(lastAuthTokenJSON);
        if (Date.now() - lastAuthTime < 3000000) {
            this.isAuth = true;
            this.delayCheckAuth(lastAuthToken);
        }
    }

    public async login(username: string, password: string) {
        const authResponse = await this.endpoint.sendAuth(username, password);
        if (!authResponse || !authResponse.data) {
            this.isAuth = false;
            return;
        }

        if (authResponse.data.isSuccess === true) {
            this.isAuth = true;
            localStorage.setItem("lastTokenTime", JSON.stringify(Date.now()));
            localStorage.setItem("lastToken", JSON.stringify(authResponse.data.refreshToken));
            this.router.navigate([""]);
            return;
        } else {
            this.stateService.errorMessage = authResponse.data.errorDescription;
        }
        this.isAuth = false;
    }

    public delayCheckAuth(refreshToken: string) {
        this.endpoint.sendAuthRefresh(refreshToken).then((result) => {
            console.log("!! | this.endpoint.sendAuthRefresh | result", result)
            if (!result?.data?.isSuccess) {
                this.isAuth = false;
                this.router.navigate(["login"]);
            } else {
                this.isAuth = true;
                localStorage.setItem("lastTokenTime", JSON.stringify(Date.now()));
                localStorage.setItem("lastToken", JSON.stringify(result.data.refreshToken));
            }
        })
    }
}