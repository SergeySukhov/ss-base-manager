import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { CdkTableModule } from '@angular/cdk/table';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ListSelectorComponent } from './list-selector/list-selector.component';
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatStepperModule } from "@angular/material/stepper";
import { StepperComponent } from "./stepper/stepper.component";
import { FileLoaderComponent } from './file-loader/file-loader.component';
import { DndDirective } from "./file-loader/directives/dnd.directive";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatRippleModule } from '@angular/material/core';
import { MatListModule } from '@angular/material/list';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialogModule } from '@angular/material/dialog';
import { LoginComponent } from './login/login.component';
import { MatCardModule } from "@angular/material/card";
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCheckboxModule } from "@angular/material/checkbox";
import { ToolbarComponent } from './toolbar/toolbar.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TableNormoControlComponent } from './table-normo-control/table-normo-control.component';
import { MatTableModule } from '@angular/material/table';
import { MatTreeModule } from "@angular/material/tree";
import { PreviewComponent } from './preview/preview.component';
import { A11yModule } from '@angular/cdk/a11y';
import { MatSortModule } from '@angular/material/sort';
import { BaseTypePipe } from '../core/pipes/base-type.pipe';
import { LogViewerComponent } from './log-viewer/log-viewer.component';
import { NotificationComponent } from './notification/notification.component';
import { AddNodeDialogComponent } from '../shared/common-components/table-node-dialog/add-node-dialog/add-node-dialog.component';
import { TableControlDialogComponent } from '../shared/common-components/table-node-dialog/table-control-dialog/table-control-dialog.component';

@NgModule({
  declarations: [
    ListSelectorComponent,
    StepperComponent,
    FileLoaderComponent,
    DndDirective,
    LoginComponent,
    ToolbarComponent,
    TableNormoControlComponent,
    PreviewComponent,
    TableControlDialogComponent,
    AddNodeDialogComponent,
    LogViewerComponent,
    NotificationComponent,
  ],
  exports: [
    ListSelectorComponent,
    StepperComponent,
    FileLoaderComponent,
    DndDirective,
    LoginComponent,
    ToolbarComponent,
    TableNormoControlComponent,
    PreviewComponent,
    TableControlDialogComponent,
    AddNodeDialogComponent,
    LogViewerComponent,

  ],
  imports: [
    CommonModule,
    FormsModule,
    A11yModule,
    ReactiveFormsModule,
    DragDropModule,
    CdkStepperModule,
    CdkTableModule,
    MatTableModule,
    MatDialogModule,
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
    MatCardModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatTreeModule,
    MatSortModule,

  ],
  providers: [
    BaseTypePipe,
  ],

  bootstrap: [TableControlDialogComponent, AddNodeDialogComponent]
})
export class SecondaryModule { }
