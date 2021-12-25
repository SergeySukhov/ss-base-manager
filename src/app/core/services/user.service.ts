import { EventEmitter, Injectable } from "@angular/core";
import { LocalStorageService } from "./local-storage.service";


@Injectable()
export class UserService {
    
    username: string = "guest";
    gacciUser: boolean = false;

    userChange = new EventEmitter<string>();

    constructor(private storageService: LocalStorageService) {

    }

    setName(name: string) {
        this.username = name;
        this.gacciUser = this.username.includes("voro");
        this.userChange.emit(this.username);
    }


}
