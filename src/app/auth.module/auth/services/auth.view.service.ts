import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AuthEndpointService } from "./auth.endpoint.service";
import { AuthStateService } from "./auth.state.service";

@Injectable()
export class AuthViewService {

    public get isAuth(): boolean {
        return this.pIsAuth;
    }

    private set isAuth(value: boolean) {
        this.pIsAuth = value;
    }

    private pIsAuth = false;

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

    public async login(username: string, password: string, needRemember: boolean): Promise<string> {
        const authResponse = await this.endpoint.sendAuth(username, password);

        if (!authResponse || !authResponse.data) {
            this.isAuth = false;
            return "Ошибка! Время ожидания ответа истекло";
        }

        if (authResponse.data.isSuccess === true) {
            this.isAuth = true;
            if (needRemember) {
                localStorage.setItem("lastTokenTime", JSON.stringify(Date.now()));
            } else {
                localStorage.removeItem("lastTokenTime");
            }
            setTimeout(() => {
                this.router.navigate([""]);
            }, 500)
            return "";
        } else {
            this.stateService.errorMessage = authResponse.data.errorDescription;
        }
        this.isAuth = false;
        return authResponse.data.errorDescription;
    }

    public async logout() {
        this.isAuth = false;
        localStorage.removeItem("lastTokenTime");
        this.router.navigate(["login"]);
        this.endpoint.sendLogout();
    }

    private delayCheckAuth() {
        this.endpoint.sendAuthRefresh().then((result) => {
            if (!result?.data?.isSuccess) {
                this.logout();
            } else {
                this.isAuth = true;
                localStorage.setItem("lastTokenTime", JSON.stringify(Date.now()));
            }
        });
    }
}