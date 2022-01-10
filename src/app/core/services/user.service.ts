import { EventEmitter, Injectable } from "@angular/core";
import { ManagerContext } from "src/app/shared/models/common/enums";
import { v4 } from "uuid";
import { GachiType } from "../common/models/user.models";
import { LocalStorageConst, LocalStorageService } from "./local-storage.service";

type MuscleMap = {
    [key in GachiType]: string;
};

@Injectable()
export class UserService {

    public username: string = "guest";

    public vipUserImgSrc = "";

    public set lastContext(value: ManagerContext) {
        this.pLastContext = value;
        this.storageService.setItem(LocalStorageConst.lastContext, value);
    }
    public get lastContext(): ManagerContext {
        return this.pLastContext;
    }
    public get userId(): string {
        return this.pUserId;
    }

    public userChange = new EventEmitter<string>();
    private pLastContext: ManagerContext;
    private pUserId: string;

    private readonly muscleSrcMap: MuscleMap = {
        none: "",
        van: "assets\\icons\\van.jpg",
        billy: "assets\\icons\\g.jpg",
        danny: "assets\\icons\\danny.jpg",
        steve: "assets\\icons\\steve.png",
    };

    constructor(private storageService: LocalStorageService) {
        this.pLastContext = storageService.getItem(LocalStorageConst.lastContext) ?? ManagerContext.start;
        this.pUserId = storageService.getItem(LocalStorageConst.userId) ?? v4();
        
        storageService.setItem(LocalStorageConst.userId, this.pUserId);
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

    onLogout() {
        this.userChange.emit();
    }

}
