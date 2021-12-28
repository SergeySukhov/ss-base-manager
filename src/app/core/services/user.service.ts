import { EventEmitter, Injectable } from "@angular/core";
import { GachiType } from "../common/models/models";
import { LocalStorageConst, LocalStorageService } from "./local-storage.service";

type MuscleMap = {
    [key in GachiType]: string;
};

@Injectable()
export class UserService {

    public username: string = "guest";
    public vipUserImgSrc = "";

    public userChange = new EventEmitter<string>();

    private readonly muscleSrcMap: MuscleMap = {
        none: "",
        van: "assets\\icons\\van.jpg",
        billy: "assets\\icons\\g.jpg",
        danny: "assets\\icons\\danny.jpg",
        steve: "assets\\icons\\steve.png",
    };
    
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
            this.vipUserImgSrc = this.muscleSrcMap.steve;
        }
        if (this.username.includes("suh")) {
            this.vipUserImgSrc = this.muscleSrcMap.van;
        }
        if (this.username.includes("ker")) {
            this.vipUserImgSrc = this.muscleSrcMap.danny;
        }
        if (this.username.includes("kir")) {
            this.vipUserImgSrc = this.muscleSrcMap.billy;
        }

        this.userChange.emit(this.username);
    }


}
