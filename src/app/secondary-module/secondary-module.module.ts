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
 
    MatIconModule,
    MatInputModule,
    MatSelectModule,
  ],
  providers: [
  ]
})
export class SecondaryModule { }
