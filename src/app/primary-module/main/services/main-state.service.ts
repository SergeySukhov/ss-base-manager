import { Injectable } from "@angular/core";
import { action, computed, observable, reaction } from "mobx";
import { UserService } from "src/app/core/services/user-services/user.service";
import { ManagerContext } from "src/app/shared/models/common/enums";

@Injectable()
export class MainStateService {
    @observable context: ManagerContext | undefined;
    @observable tooltipUserImageSrc = "";

    constructor(private userService: UserService,) {
    }

    @action setContext(value: ManagerContext) {
        this.context = value;
    }

    @computed({ keepAlive: true }) get mainTitle() {
        this.userService.lastContext = this.context ?? ManagerContext.start;
        switch (this.context) {
            case ManagerContext.start:
                return "Менеджер микросервисов баз Estimate Office";
            case ManagerContext.normbase:
                return "Менеджер добавления микросервисов нормативных баз Estimate Office";
            case ManagerContext.indexes:
                return "Менеджер добавления микросервисов баз индесков Estimate Office";
            case ManagerContext.formula:
                return "Менеджер добавления микросервисов баз формул Estimate Office";
            case ManagerContext.multipleUploader:
                return "Менеджер множественного добавления микросервисов баз Estimate Office";
            case ManagerContext.uploadViewer:
                return "Мониторинг загрузок";
            case ManagerContext.manager:
                return "Менеджер управления параматрами баз Estimate Office";
            case ManagerContext.logs:
                return "Мониторинг сообщений";
            default:
                return "Неизвестный контекст";
        }
    }


}
