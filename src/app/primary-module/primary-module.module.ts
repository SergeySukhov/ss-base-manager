import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';
import { MainStateService } from './services/main-state.service';
import { RouterModule, Routes } from '@angular/router';
import { SecondaryModule } from '../secondary-module/secondary-module.module';
import { AuthModule } from '../auth/auth.module';
import { UserService } from '../core/common/services/user.service';
import { EndpointService } from '../core/common/services/endpoint.service';


  // определение маршрутов
  const appRoutes: Routes = [
    { path: '', component: MainComponent},
    // { path: '**', component: NotFoundComponent }
  ];

@NgModule({
  declarations: [
    MainComponent,
  ],
  exports: [
    MainComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forRoot(appRoutes),
    SecondaryModule,
    AuthModule,

  ],
  providers: [
    MainStateService,
    EndpointService,
    UserService,
  ]
})
export class PrimaryModule { }
