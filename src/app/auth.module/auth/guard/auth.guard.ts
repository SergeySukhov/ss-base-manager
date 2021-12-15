import { Injectable, OnDestroy } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AuthViewService } from "../services/auth.view.service";

 @Injectable()
 export class AuthGuard implements CanActivate, OnDestroy {

    constructor(authService: AuthViewService, private router: Router,) {

    }
     canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Promise<boolean> {
        this.router.navigate(["login"])
        return false;
     }
     
     ngOnDestroy(): void {
     }
    
 }
 