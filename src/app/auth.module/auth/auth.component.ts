import { Component, OnInit } from '@angular/core';
import { ThemeService } from "../../primary-module/main/services/theme.service";
import { AuthEndpointService } from "./services/auth.endpoint.service";
import { AuthStateService } from "./services/auth.state.service";
import { AuthViewService } from "./services/auth.view.service";

@Component({
  selector: 'ss-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {

  

  constructor(public themeService: ThemeService, private viewService: AuthViewService, public stateService: AuthStateService) { }

  ngOnInit(): void {
  }

  public async submitEventHandle(userData: {username: string, password: string}) {
    console.log("!! | submitEventHandle | userData", userData)
    this.stateService.isLoading = true;

    await this.viewService.login(userData.username, userData.password);
    this.stateService.isLoading = false;

  }

}
