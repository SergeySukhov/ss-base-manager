import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable()
export class MainStateService {
    constructor(private router: Router) {
    }
}
