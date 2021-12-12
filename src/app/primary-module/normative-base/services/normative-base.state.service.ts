import { Injectable } from "@angular/core";
import { action, computed, observable, reaction } from "mobx";
import { SelectorOption, StepFields, StepperData, StepperDataStep } from "src/app/secondary-module/stepper/models/stepper-model";
import { NormativeBaseDeclarationService } from "./normative-base.declaration.service";

@Injectable()
export class NormativeBaseStateService {
    @observable availableNormativeBases: string[] = [];


    // @computed({ keepAlive: true }) get availableNormativeBaseOptions(): SelectorOption[] {
    // }
    constructor() {
    }

    @action a() {

    }

   


}
