import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from "@angular/material/toolbar";
import { AuthComponent } from "./auth/auth.component";
import { SecondaryModule } from "../secondary-module/secondary-module.module";
import { AuthGuard } from "./auth/guards/auth.guard";
import { AuthViewService } from "./auth/services/auth.view.service";
import { AuthEndpointService } from "./auth/services/auth.endpoint.service";
import { AuthStateService } from "./auth/services/auth.state.service";
import { AuthGuardLogin } from "./auth/guards/auth.login.guard";



@NgModule({
  declarations: [
    AuthComponent,
  ],
  imports: [
    CommonModule,
    SecondaryModule,

  ],
  providers: [AuthGuard, AuthGuardLogin, AuthViewService, AuthEndpointService, AuthStateService]
})
export class AuthModule { }
