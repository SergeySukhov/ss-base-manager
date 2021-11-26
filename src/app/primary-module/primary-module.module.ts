import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {MatButtonModule} from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatChipsModule} from '@angular/material/chips';
import {MatStepperModule} from '@angular/material/stepper';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDividerModule} from '@angular/material/divider';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSliderModule} from '@angular/material/slider';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {MatTabsModule} from '@angular/material/tabs';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatTreeModule} from '@angular/material/tree';
import {OverlayModule} from '@angular/cdk/overlay';

import { MainComponent } from './main/main.component';
import { MainStateService } from './services/main-state.service';
import { RouterModule, Routes } from '@angular/router';
import { SecondaryModule } from '../secondary-module/secondary-module.module';
import { AuthModule } from '../auth/auth.module';
import { UserService } from '../core/common/services/user.service';
import { EndpointService } from '../core/common/services/endpoint.service';
import { FormsModule } from '@angular/forms';
import { DndDirective } from "./main/directives/dnd.directive";


// определение маршрутов
const appRoutes: Routes = [
  { path: '', component: MainComponent },
  // { path: '**', component: NotFoundComponent }
];

@NgModule({
  declarations: [
    MainComponent,
    DndDirective
  ],
  exports: [
    MainComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forRoot(appRoutes),
    FormsModule,

    MatStepperModule,
    MatButtonModule,
 
    MatIconModule,
    MatInputModule,
    MatSelectModule,

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
