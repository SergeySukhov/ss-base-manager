import { Injectable } from "@angular/core";
import { DeclarationBaseService } from "src/app/core/services/base-services/declaration-base.service";
import { SelectorOption, StepFields, StepperData, OptionType, StepperDataStep } from "src/app/secondary-module/stepper/models/stepper-model";
import { AvailableBaseAdditionInfo } from "src/app/shared/models/server-models/AvailableBaseAdditionInfo";
import { AvailableBaseIndexInfo } from "src/app/shared/models/server-models/AvailableBaseIndexInfo";
import { AvailableNormativeBaseType } from "src/app/shared/models/server-models/AvailableNormativeBaseType";
import { v4 } from "uuid";
import { BaseTypeInfo } from "../../formula-base/models/form-base.models";
import { IndexBaseComponent } from "../index-base.component";
import { IndexBaseResultParams } from "../models/index-base.model";
import { IndexBaseEndpointService } from "./index-base.endpoint.service";

@Injectable()
export class IndexBaseDeclarationService extends DeclarationBaseService<AvailableBaseIndexInfo, IndexBaseResultParams> {

    finalOptions: StepFields[] = [];
    constructor(private endpoint: IndexBaseEndpointService) {
        super(endpoint);
    }

    public getStepperModel(context: IndexBaseComponent, avTypes: AvailableNormativeBaseType[]): StepperData {
        const stepperModel: StepperData = {
            isLinear: true,
            steps: [
                this.getBaseTypeStep(avTypes, context.resultParams, this.endpoint.getAvailableIndeciesBases.bind(this.endpoint)),
                ////////////////////////////////////////////////////////////////////
                {
                    stepLabel: "Выбор НБ",
                    nextButton: { needShow: true, isDisable: true },
                    backButton: { needShow: true, isDisable: false },
                    fields: [{
                        type: OptionType.selector,
                        fieldLabel: "Доступные базы индексов",
                        onDataChange: (value: SelectorOption<AvailableBaseIndexInfo>, form: StepperDataStep) => {
                            context.resultParams.baseChoice = value.data as AvailableBaseIndexInfo;

                            this.setAddBaseForm(!!value.imgSrc, context, form);

                            if (form.nextButton) {
                                form.nextButton.isDisable = !context.resultParams.baseChoice;;
                            }
                            form.isCompleted = !form.nextButton?.isDisable
                            this.updateResultParams(context.resultParams);
                        },
                        fieldOptions: this.baseFieldOptions,
                    },
                    ],
                },
            ],
        }
        return stepperModel;
    }

    protected toFinalData(resultParams: IndexBaseResultParams): StepFields[] {
        throw new Error("Method not implemented.");
    }

    protected toSelectorBaseOptions(baseData: AvailableBaseIndexInfo[]): SelectorOption<AvailableBaseIndexInfo>[] {
        const selectorOptions: SelectorOption<AvailableBaseIndexInfo>[] = [];
        baseData.forEach(x => {
            selectorOptions.push({
                isAvailable: true,
                value: "",
                data: x,
                action: () => {
                }
            });
        });
        return selectorOptions;
    }

    private setAddBaseForm(needAddForm: boolean, context: IndexBaseComponent, form: StepperDataStep) {
        if (needAddForm) {
            context.resultParams.addBase = {
                guid: v4(),
                name: "",
                additionNumber: 1,
            }
            context.resultParams.baseChoice = null;
            form.stepLabel = "Добавление новой НБ"
            form.fields.push(
                {
                    type: OptionType.label,
                    text: context.resultParams.addBase.guid,
                    fieldLabel: "Идентификатор добаляемой НБ",
                    onDataChange: () => { }
                }, {
                type: OptionType.input,
                fieldLabel: "Наименование НБ",
                placeHolder: "",
                onDataChange: (value: string, form: StepperDataStep) => {
                    if (context.resultParams.addBase) {
                        context.resultParams.addBase.name = value;
                        if (form.nextButton) {
                            form.nextButton.isDisable = !value;
                        }
                        form.isCompleted = !!value;
                    }
                }

            }, {
                type: OptionType.input,
                fieldLabel: "Номер дополнения",
                placeHolder: "",
                onDataChange: (value: string) => {
                    if (context.resultParams.addBase) {
                        context.resultParams.addBase.additionNumber = Number.parseInt(value);
                    }
                }

            },
            )
        } else {
            form.stepLabel = "Выбор НБ"
            context.resultParams.addBase = undefined;
            form.fields.splice(1);
        }
        return;
    }
}
