import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SettingService } from "./services/global-settings.service";
import { LocalStorageService } from "./services/local-storage.service";
import { NotificationService } from "./services/notification.service";
import { UserService } from "./services/user.service";

@NgModule({
    declarations: [
    ],
    imports: [
        CommonModule,

    ],
    providers: [
        UserService,
        SettingService,
        LocalStorageService,
    ]
})
export class CoreModule { }