import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from './services/data.service';
import { ListSelectorComponent } from './list-selector/list-selector.component';

@NgModule({
  declarations: [
    ListSelectorComponent
  ],
  exports: [
    ListSelectorComponent
  ],
  imports: [
    CommonModule,
  ],
  providers: [
    DataService,
  ]
})
export class SecondaryModule { }
