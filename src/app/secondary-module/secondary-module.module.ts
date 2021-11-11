import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from './services/data.service';

@NgModule({
  declarations: [
  ],
  exports: [
  ],
  imports: [
    CommonModule,
  ],
  providers: [
    DataService,
  ]
})
export class SecondaryModule { }
