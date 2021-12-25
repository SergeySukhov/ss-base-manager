import { Injectable } from "@angular/core";
import { LocalStorageService } from "./local-storage.service";


@Injectable()
export class SettingService {

    

    constructor(private storageService: LocalStorageService) {
    }

}