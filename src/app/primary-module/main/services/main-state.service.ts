import { Injectable } from "@angular/core";
import { action, computed, observable, reaction } from "mobx";
import { UserService } from "src/app/core/services/user.service";
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
            case ManagerContext.base:
                return "Менеджер нормативных баз Estimate Office";
            case ManagerContext.indexes:
                return "Менеджер баз индесков Estimate Office";
            case ManagerContext.formula:
                return "Менеджер баз формул Estimate Office";
            case ManagerContext.manager:
                return "Менеджер управления доступностью баз Estimate Office";
            case ManagerContext.logs:
                return "Мониторинг сообщений";
            default:
                return "Неизвестный контекст";
        }
    }


}
