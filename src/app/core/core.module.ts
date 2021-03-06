import { CommonModule, DatePipe } from "@angular/common";
import { NgModule } from "@angular/core";
import { BaseTypePipe } from "./pipes/base-type.pipe";
import { ChildNodesAvailablePipe } from "./pipes/child-nodes-available.pipe";
import { PeriodPipe } from "./pipes/period.pipe";
import { ProcStatePipe } from "./pipes/proc-state.pipe";
import { WorkCategoryPipe } from "./pipes/work-type.pipe";
import { SettingService } from "./services/global-settings.service";
import { LocalStorageService } from "./services/local-storage.service";
import { UserEndpointService } from "./services/user-services/user-endpoint.service";
import { UserService } from "./services/user-services/user.service";

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
        DatePipe,
        ChildNodesAvailablePipe,
        PeriodPipe,
        BaseTypePipe,
        WorkCategoryPipe,
        ProcStatePipe,
        UserEndpointService,
    ]
})
export class CoreModule { }