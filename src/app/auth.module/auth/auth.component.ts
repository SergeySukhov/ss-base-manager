import { Component, OnInit } from '@angular/core';
import { ThemeService } from "../../primary-module/main/services/theme.service";
import { AuthEndpointService } from "./services/auth.endpoint.service";
import { AuthViewService } from "./services/auth.view.service";

@Component({
  selector: 'ss-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {

  constructor(public themeService: ThemeService,) { }

  ngOnInit(): void {
  }

}
