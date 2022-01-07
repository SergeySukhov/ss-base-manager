import { Injectable } from "@angular/core";
import { SelectorOption, StepFields, StepperData } from "src/app/secondary-module/stepper/models/stepper-model";
import { AvailableNormativeBaseType } from "src/app/shared/models/server-models/AvailableNormativeBaseType";

@Injectable()
export abstract class DeclarationBaseService<TResult> {
    protected normBaseFieldOptions: SelectorOption<any>[] = [];
    protected finalOptions: StepFields[] = [];


    public abstract getStepperModel(context: any, avTypes: AvailableNormativeBaseType[]): StepperData;

    protected abstract toFinalData(resultParams: TResult): StepFields[]

    protected updateResultParams(resultParams: TResult) {
        this.finalOptions.splice(0);
        this.finalOptions.push(...this.toFinalData(resultParams));
    }

}
