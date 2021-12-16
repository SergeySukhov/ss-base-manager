import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from "@angular/material/toolbar";
import { AuthComponent } from "./auth/auth.component";
import { SecondaryModule } from "../secondary-module/secondary-module.module";
import { AuthGuard } from "./auth/guard/auth.guard";
import { AuthViewService } from "./auth/services/auth.view.service";
import { AuthEndpointService } from "./auth/services/auth.endpoint.service";
import { AuthStateService } from "./auth/services/auth.state.service";



@NgModule({
  declarations: [
    AuthComponent,
  ],
  imports: [
    CommonModule,
    MatToolbarModule,
    SecondaryModule,

  ],
  providers: [AuthGuard, AuthViewService, AuthEndpointService, AuthStateService]
})
export class AuthModule { }
