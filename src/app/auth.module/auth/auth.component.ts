import { Component, OnInit } from '@angular/core';
import { ThemeService } from "../../secondary-module/toolbar/services/theme.service";
import { AuthEndpointService } from "./services/auth.endpoint.service";
import { AuthStateService } from "./services/auth.state.service";
import { AuthViewService } from "./services/auth.view.service";

@Component({
  selector: 'ss-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  isUnlock = false;  
  errorMessage = "";  

  constructor(public themeService: ThemeService, private viewService: AuthViewService, public stateService: AuthStateService) {

  }

  ngOnInit(): void {
  }

  public async submitEventHandle(userData: {username: string, password: string, needRemember: boolean}) {
    this.stateService.isLoading = true;
    this.errorMessage = "";
    this.errorMessage = await this.viewService.login(userData.username, userData.password, userData.needRemember);
    this.isUnlock = !this.errorMessage;
    this.stateService.isLoading = false;

  }

}
