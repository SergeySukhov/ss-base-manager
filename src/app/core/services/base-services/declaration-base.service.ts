import { Injectable } from "@angular/core";
import { BaseTypeInfo } from "src/app/primary-module/formula-base/models/form-base.models";
import { OptionType, SelectorOption, StepFields, StepperData, StepperDataStep } from "src/app/secondary-module/stepper/models/stepper-model";
import { AvailableNormativeBaseType } from "src/app/shared/models/server-models/AvailableNormativeBaseType";
import { EndpointBaseService } from "./endpoint-base.service";

@Injectable()
export abstract class DeclarationBaseService<TResult> {
    protected normBaseFieldOptions: SelectorOption<any>[] = [];
    protected finalOptions: StepFields[] = [];

    constructor(private endpointService: EndpointBaseService) {

    }

    public abstract getStepperModel(context: any, avTypes: AvailableNormativeBaseType[]): StepperData;

    protected abstract toFinalData(resultParams: TResult): StepFields[]

    protected updateResultParams(resultParams: TResult) {
        this.finalOptions.splice(0);
        this.finalOptions.push(...this.toFinalData(resultParams));
    }

    protected getBaseTypeStep(avTypes: AvailableNormativeBaseType[], dataChangeAfterAction: (params?: any) => void) {
        const step: StepperDataStep = {
            stepLabel: "Выбор вида НБ",
            nextButton: { needShow: true, isDisable: true },
            isAwaiting: false,
            fields: [{
                type: OptionType.selector,
                fieldLabel: "Доступные виды нормативных баз",
                onDataChange: async (value: SelectorOption<BaseTypeInfo>, step: StepperDataStep) => {
                    const data = value.data as BaseTypeInfo;
                    step.isAwaiting = true;

                    const availableNB = await this.endpointService.getAvailableNormativeBases(data.type);
                    if (!availableNB) {
                        step.isAwaiting = false;
                        step.isCompleted = false;
                        return;
                    }
                   
                    step.isAwaiting = false;
                    step.isCompleted = true;
                    if (step.nextButton) {
                        step.nextButton.isDisable = false;
                    }
                    dataChangeAfterAction();
                },
                fieldOptions: this.toSelectorBaseTypeOptions(avTypes),
            }],
        }
        return step;
    }

    protected toSelectorBaseTypeOptions(baseData: AvailableNormativeBaseType[]): SelectorOption<AvailableNormativeBaseType>[] {
        const selectorOptions: SelectorOption<AvailableNormativeBaseType>[] = [];
        baseData.forEach(x => {
            selectorOptions.push({
                isAvailable: true,
                value: x.typeName,
                data: x,
                action: () => {
                }
            });
        });
        return selectorOptions;
    }
}
