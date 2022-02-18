import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { BaseTypeInfo } from "src/app/primary-module/formula-base/models/form-base.models";
import { ResultUploadParamsBase } from "src/app/primary-module/normative-base/models/base-result-params.model";
import { OptionType, SelectorOption, StepFields, StepperData, StepperDataStep } from "src/app/secondary-module/stepper/models/stepper-model";
import { AvailableNormativeBaseType, BaseType } from "src/app/shared/models/server-models/AvailableNormativeBaseType";
import { BaseTypePipe } from "../../pipes/base-type.pipe";

@Injectable()
export abstract class DeclarationBaseService<TAvailableBase, TResultOptions extends ResultUploadParamsBase<TAvailableBase>> {

    public updateParamsSub = new Subject<TResultOptions>();

    /** Выбор базы (замена существующей или добавление новой) */
    protected baseFieldOptions: SelectorOption<TAvailableBase>[] = [];
    protected baseStartOption: SelectorOption<TAvailableBase> | undefined;

    protected finalOptions: StepFields[] = [];

    protected baseTypePipe = new BaseTypePipe();

    constructor() {
    }

    public abstract getStepperModel(context: any, avTypes: AvailableNormativeBaseType[]): StepperData;

    protected abstract toFinalData(resultParams: TResultOptions): StepFields[]
    protected abstract toSelectorBaseOptions(bases: TAvailableBase[]): SelectorOption<TAvailableBase>[]

    public updateResultParams(resultParams: TResultOptions) {
        this.finalOptions.splice(0);
        this.finalOptions.push(...this.toFinalData(resultParams));
        this.updateParamsSub.next(resultParams);
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
                value: this.baseTypePipe.transform(x.type),
                data: x,
                action: () => {
                }
            });
        });
        return selectorOptions;
    }


    protected getBaseTypeStep(avTypes: AvailableNormativeBaseType[], resultParams: TResultOptions,
        getDataForNexStep: (baseType: BaseType) => Promise<TAvailableBase[] | null>): StepperDataStep {

        const baseTypeOptions = this.toSelectorBaseTypeOptions(avTypes);

        const step: StepperDataStep = {
            stepLabel: "Выбор вида НБ",
            nextButton: { needShow: true, isDisable: !resultParams.baseType },
            isCompleted: !!resultParams.baseType,
            isAwaiting: false,
            fields: [{
                fieldOptions: baseTypeOptions,
                type: OptionType.selector,
                startOption: baseTypeOptions.find(x => x.value === this.baseTypePipe.transform(resultParams.baseType)),
                fieldLabel: "Доступные виды нормативных баз",
                onDataChange: async (value: SelectorOption<BaseTypeInfo>, form: StepperDataStep) => {
                    console.log("!! | onDataChange: | value", value)
                    const data = value.data as BaseTypeInfo;
                    resultParams.baseType = data.type;

                    form.isAwaiting = true;
                    const availableNB = await getDataForNexStep(data.type);
                    form.isAwaiting = false;

                    this.setAvailableBasesOptions(availableNB ?? []);

                    form.isCompleted = true;
                    resultParams.baseTypeName = data.name;

                    if (form.nextButton) {
                        form.nextButton.isDisable = false;
                    }

                    this.updateResultParams(resultParams);
                },
            }],
        }
        return step;
    }
}
