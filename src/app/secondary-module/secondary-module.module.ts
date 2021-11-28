import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListSelectorComponent } from './list-selector/list-selector.component';
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatStepperModule } from "@angular/material/stepper";
import { StepperComponent } from "./stepper/stepper.component";
import { FileLoaderComponent } from './file-loader/file-loader.component';
import { DndDirective } from "./directives/dnd.directive";
import { FormsModule } from "@angular/forms";
import { MatRippleModule } from '@angular/material/core';
import { MatListModule } from '@angular/material/list';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';

@NgModule({
  declarations: [
    ListSelectorComponent,
    StepperComponent,
    FileLoaderComponent,
    DndDirective,

  ],
  exports: [
    ListSelectorComponent,
    StepperComponent,
    FileLoaderComponent,
    DndDirective,

  ],
  imports: [
    CommonModule,
    FormsModule,

    MatStepperModule,
    MatButtonModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatToolbarModule,
    MatSlideToggleModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatRippleModule,
    MatListModule,
  ],
  providers: [
  ]
})
export class SecondaryModule { }
