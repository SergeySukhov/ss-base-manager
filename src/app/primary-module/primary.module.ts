import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { OverlayModule } from '@angular/cdk/overlay';

import { MainComponent } from './main/main.component';
import { MainStateService } from './main/services/main-state.service';
import { RouterModule, Routes } from '@angular/router';
import { SecondaryModule } from '../secondary-module/secondary-module.module';
import { AuthModule } from '../auth.module/auth.module';
import { UserService } from '../core/common/services/user.service';
import { EndpointService } from '../core/common/services/endpoint.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ThemeService } from "./main/services/theme.service";
import { NormativeBaseComponent } from './normative-base/normative-base.component';
import { AuthComponent } from '../auth.module/auth/auth.component';


// определение маршрутов
// const appRoutes: Routes = [
//   { path: '', component: MainComponent },
//   { path: 'login', component: AuthComponent },
//   // { path: '**', component: NotFoundComponent }
// ];

@NgModule({
  declarations: [
    MainComponent,
    NormativeBaseComponent,
  ],
  exports: [
    MainComponent,
  ],
  imports: [
    CommonModule,
    // RouterModule.forRoot(appRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatToolbarModule,
    MatSlideToggleModule,
    MatIconModule,

    SecondaryModule,

  ],
  providers: [
    MainStateService,
    EndpointService,
    UserService,
    ThemeService,
  ]
})
export class PrimaryModule { }
