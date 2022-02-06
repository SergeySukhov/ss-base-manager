import { Injectable } from "@angular/core";
import { BaseTypeInfo } from "src/app/primary-module/formula-base/models/form-base.models";
import { ResultUploadParamsBase } from "src/app/primary-module/normative-base/models/base-result-params.model";
import { OptionType, SelectorOption, StepFields, StepperData, StepperDataStep } from "src/app/secondary-module/stepper/models/stepper-model";
import { AvailableNormativeBaseType, BaseType } from "src/app/shared/models/server-models/AvailableNormativeBaseType";
import { EndpointBaseService } from "./endpoint-base.service";

@Injectable()
export abstract class DeclarationBaseService<TAvailableBase, TResultOptions extends ResultUploadParamsBase<TAvailableBase>> {

    /** Выбор базы (замена существующей или добавление новой) */
    protected baseFieldOptions: SelectorOption<TAvailableBase>[] = [];

    protected finalOptions: StepFields[] = [];



    constructor(private endpointService: EndpointBaseService) {
    }

    public abstract getStepperModel(context: any, avTypes: AvailableNormativeBaseType[]): StepperData;

    protected abstract toFinalData(resultParams: TResultOptions): StepFields[]
    protected abstract toSelectorBaseOptions(bases: TAvailableBase[]): SelectorOption<TAvailableBase>[]

    protected updateResultParams(resultParams: TResultOptions) {
        console.log("!! | updateResultParams | resultParams", resultParams)
        this.finalOptions.splice(0);
        this.finalOptions.push(...this.toFinalData(resultParams));
    }

    protected setAvailableBasesOptions(dataOptions: TAvailableBase[]) {
        this.baseFieldOptions.splice(0);
        this.baseFieldOptions.push(...this.toSelectorBaseOptions(dataOptions));
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


    protected getBaseTypeStep(avTypes: AvailableNormativeBaseType[], resultParams: TResultOptions,
        getDataForNexStep: (baseType: BaseType) => Promise<TAvailableBase[] | null>,
        dataChangeAfterAction?: { action: (params?: any) => void, params?: any }): StepperDataStep {

        const step: StepperDataStep = {
            stepLabel: "Выбор вида НБ",
            nextButton: { needShow: true, isDisable: true },
            isAwaiting: false,
            fields: [{
                fieldOptions: this.toSelectorBaseTypeOptions(avTypes),
                type: OptionType.selector,
                fieldLabel: "Доступные виды нормативных баз",
                onDataChange: async (value: SelectorOption<BaseTypeInfo>, step: StepperDataStep) => {
                    const data = value.data as BaseTypeInfo;
                    console.log("!! | onDataChange: | data", data)
                    step.isAwaiting = true;

                    const availableNB = await getDataForNexStep(data.type);
                    step.isAwaiting = false;

                    if (!availableNB) {
                        step.isCompleted = false;
                        return;
                    }
                    resultParams.baseTypeName = data.name;
                    this.setAvailableBasesOptions(availableNB);

                    step.isCompleted = true;
                    if (step.nextButton) {
                        step.nextButton.isDisable = false;
                    }
                    
                    dataChangeAfterAction?.action(dataChangeAfterAction.params);
                    this.updateResultParams(resultParams);
                },
            }],
        }
        return step;
    }


}
