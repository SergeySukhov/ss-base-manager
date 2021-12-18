import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AuthEndpointService } from "./auth.endpoint.service";
import { AuthStateService } from "./auth.state.service";

@Injectable()
export class AuthViewService {

    public isAuth = false;

    constructor(private router: Router, private endpoint: AuthEndpointService, private stateService: AuthStateService) {
        const lastAuthTimeJSON = localStorage.getItem("lastTokenTime");
        if (!lastAuthTimeJSON) {
            return;
        }

        const lastAuthTime = JSON.parse(lastAuthTimeJSON);
        if (Date.now() - lastAuthTime < 3000000) {
            this.isAuth = true;
            this.delayCheckAuth();
        }
    }

    public async login(username: string, password: string, needRemember: boolean): Promise<boolean> {
        const authResponse = await this.endpoint.sendAuth(username, password);

        if (!authResponse || !authResponse.data) {
            this.isAuth = false;
            return false;
        }

        if (authResponse.data.isSuccess === true) {
            this.isAuth = true;
            if (needRemember) {
                localStorage.setItem("lastTokenTime", JSON.stringify(Date.now()));
            } else {
                localStorage.removeItem("lastTokenTime");
                // localStorage.removeItem("lastToken");
            }
            setTimeout(() => {
                this.router.navigate([""]);
            }, 2000)
            return true;
        } else {
            this.stateService.errorMessage = authResponse.data.errorDescription;
        }
        this.isAuth = false;
        return false;
    }

    public delayCheckAuth(
        // refreshToken: string
        ) {
        this.endpoint.sendAuthRefresh(
            // refreshToken
            ).then((result) => {
            console.log("!! | this.endpoint.sendAuthRefresh | result", result)
            if (!result?.data?.isSuccess) {
                this.isAuth = false;
                this.router.navigate(["login"]);
            } else {
                this.isAuth = true;
                localStorage.setItem("lastTokenTime", JSON.stringify(Date.now()));
                // localStorage.setItem("lastToken", JSON.stringify(result.data.refreshToken));
            }
        })
    }
}