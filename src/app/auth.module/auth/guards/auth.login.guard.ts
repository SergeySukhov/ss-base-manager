import { Injectable, OnDestroy } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AuthViewService } from "../services/auth.view.service";

@Injectable()
export class AuthGuardLogin implements CanActivate, OnDestroy {

   constructor(private authService: AuthViewService, private router: Router,) {

   }
   canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Promise<boolean> {
      const path = route.routeConfig?.path;
      console.log("!! al | canActivate | path", path)
      console.log("!! | canActivate | this.authService.isAuth", this.authService.isAuth)

      if (path?.includes("login") && this.authService.isAuth) {
         this.router.navigate([""]);
         return false;
      }
      return true;
   }

   ngOnDestroy(): void {
   }

}
