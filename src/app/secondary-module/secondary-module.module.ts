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
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
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
import { LogViewerComponent } from './log-viewer/log-viewer.component';
import { NotificationComponent } from './notification/notification.component';
import { AddNodeDialogComponent } from '../shared/common-components/table-node-dialog/add-node-dialog/add-node-dialog.component';
import { TableControlDialogComponent } from '../shared/common-components/table-node-dialog/table-control-dialog/table-control-dialog.component';
import { TableIndeciesControlComponent } from './table-indecies-control/table-indecies-control.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UploadProcessCardComponent } from './upload-process-card/upload-process-card.component';
import {CardModule} from 'primeng/card';
import { NoDataComponent } from './no-data/no-data.component';

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
    TableIndeciesControlComponent,
    UploadProcessCardComponent,
    NoDataComponent,
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
    TableIndeciesControlComponent,
    UploadProcessCardComponent,
    NoDataComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    A11yModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    OverlayModule,
    PortalModule,
    ScrollingModule,
    CardModule,

  ],
  providers: [
  ],

  bootstrap: [TableControlDialogComponent, AddNodeDialogComponent]
})
export class SecondaryModule { }
