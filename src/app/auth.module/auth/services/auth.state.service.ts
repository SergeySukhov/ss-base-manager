import { Injectable } from "@angular/core";
import { action, computed, observable, reaction } from "mobx";

@Injectable()
export class AuthStateService {

    @observable isLoading = false;

    @observable errorMessage = "";

    constructor() {
    }
}