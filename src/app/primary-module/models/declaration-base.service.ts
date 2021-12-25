import { Injectable } from "@angular/core";
import { SelectorOption, StepFields, StepperData } from "src/app/secondary-module/stepper/models/stepper-model";

@Injectable()
export abstract class BaseDeclarationService<TResult> {
    protected normBasefieldOptions: SelectorOption<any>[] = [];
    protected finalOptions: StepFields[] = [];


    public abstract getStepperModel(context: any): StepperData;

    protected abstract toFinalData(resultParams: TResult): StepFields[]

    protected updateResultParams(resultParams: TResult) {
        this.finalOptions.splice(0);
        this.finalOptions.push(...this.toFinalData(resultParams));
    }

}
