import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PrimaryModule } from './primary-module/primary.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthModule } from "./auth.module/auth.module";
import { CoreModule } from './core/core.module';
import { DatePipe } from '@angular/common';
import { ChildNodesAvailablePipe } from './core/pipes/child-nodes-available.pipe';
import { PeriodPipe } from './core/pipes/period.pipe';
import { BaseTypePipe } from './core/pipes/base-type.pipe';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthModule,
    PrimaryModule,
    CoreModule,
    BrowserAnimationsModule,
    
  ],
  providers: [
    DatePipe,
    ChildNodesAvailablePipe,
    PeriodPipe,
    BaseTypePipe,

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
