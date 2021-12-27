import { EventEmitter, Injectable } from "@angular/core";
import { LocalStorageConst, LocalStorageService } from "./local-storage.service";


@Injectable()
export class UserService {
    
    username: string = "guest";
    gacciUser: boolean = false;

    userChange = new EventEmitter<string>();

    constructor(private storageService: LocalStorageService) {

    }

    setName(name: string) {
        this.username = name;
        this.storageService.setItem(LocalStorageConst.username, name);
        this.gacciUser = this.username.includes("bege");
        this.userChange.emit(this.username);
    }


}
