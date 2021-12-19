import { Injectable, OnDestroy } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { AuthViewService } from "../services/auth.view.service";

@Injectable()
export class AuthGuard implements CanActivate, OnDestroy {

   constructor(private authService: AuthViewService, private router: Router,) {

   }
   canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Promise<boolean> {
      // return true;

      if (this.authService.isAuth) {
         return true;
      } else {
         this.router.navigate(["login"])
         return false;
      }

   }

   ngOnDestroy(): void {
   }

}
