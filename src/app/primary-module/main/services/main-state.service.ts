import { Injectable } from "@angular/core";
import { action, computed, observable, reaction } from "mobx";
import { ManagerContext } from "src/app/shared/models/common/enums";

@Injectable()
export class MainStateService {
    @observable context = ManagerContext.start;
    @observable muscleType : "0" |"1" |"2" = "0";;

    constructor() {
    }

    @computed({ keepAlive: true }) get mainTitle() {
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
            default:
                return "Неизвестный контекст";
        }
    }


}
