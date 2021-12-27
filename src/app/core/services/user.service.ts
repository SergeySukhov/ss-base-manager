import { EventEmitter, Injectable } from "@angular/core";
import { LocalStorageConst, LocalStorageService } from "./local-storage.service";


@Injectable()
export class UserService {
    
    username: string = "guest";
    gacciUser: "0" |"1" |"2" = "0";

    userChange = new EventEmitter<string>();

    constructor(private storageService: LocalStorageService) {

    }

    setName(name?: string) {
        if (!!name) {
            this.username = name;
            this.storageService.setItem(LocalStorageConst.username, name);
        } else {
            this.username = this.storageService.getItem(LocalStorageConst.username) ?? "";
        }

        if (this.username.includes("bege")) {
            this.gacciUser = "2";
        }
        if (this.username.includes("sergey")) {
            this.gacciUser = "1";
        }
        console.log("!! | setName | name", name)

        this.userChange.emit(this.username);
    }


}
