import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from "./auth.module/auth/auth.component";
import { AuthGuard } from "./auth.module/auth/guard/auth.guard";
import { MainComponent } from "./primary-module/main/main.component";

const routes: Routes = [
  { path: 'login', component: AuthComponent },
  {
    path: "",
    loadChildren: () => import("./primary-module/primary.module").then((m) => m.PrimaryModule),
    data: { key: "MainComponent", cacheRoute: false },
    canActivate: [AuthGuard],
    component: MainComponent,
    
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
