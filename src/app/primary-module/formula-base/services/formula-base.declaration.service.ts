import { Injectable } from "@angular/core";
import { DeclarationBaseService } from "src/app/core/services/base-services/declaration-base.service";
import { OptionType, SelectorOption, StepperData, StepperDataStep, StepperSelectorField, StepFields, StepperLabelField } from "src/app/secondary-module/stepper/models/stepper-model";
import { AvailableBaseAdditionInfo } from "src/app/shared/models/server-models/AvailableBaseAdditionInfo";
import { AvailableNormativeBaseType, BaseType } from "src/app/shared/models/server-models/AvailableNormativeBaseType";
import { FormulaBaseComponent } from "../formula-base.component";
import { BaseTypeInfo, FormBaseResultParams } from "../models/form-base.models";
import { FormulaBaseEndpointService } from "./formula-base.endpoint.service";


@Injectable()
export class FormulaBaseDeclarationService extends DeclarationBaseService<AvailableBaseAdditionInfo, FormBaseResultParams> {
    finalOptions: StepFields[] = [];
    constructor(private endpoint: FormulaBaseEndpointService) {
        super();
    }

    public getStepperModel(context: FormulaBaseComponent, avTypes: AvailableNormativeBaseType[]): StepperData {
        const stepperModel: StepperData = {
            isLinear: true,
            steps: [
                this.getBaseTypeStep(avTypes, context.resultParams, this.endpoint.getAvailableNormativeBases.bind(this.endpoint)),
                ////////////////////////////////////////////////////////////////////
                {
                    stepLabel: "Выбор НБ",
                    nextButton: { needShow: true, isDisable: true },
                    backButton: { needShow: true, isDisable: false },
                    fields: [{
                        type: OptionType.selector,
                        fieldLabel: "Доступные НБ",
                        onDataChange: (value: SelectorOption<AvailableBaseAdditionInfo>, form: StepperDataStep) => {
                            context.resultParams.baseChoice = value.data as AvailableBaseAdditionInfo;

                            if (form.nextButton) {
                                form.nextButton.isDisable = false;
                            }
                            form.isCompleted = true;
                            this.updateResultParams(context.resultParams);
                        },
                        fieldOptions: this.baseFieldOptions,
                    },
                    ],
                },
                ////////////////////////////////////////////////////////////////////
                {
                    stepLabel: "Добавление файла формул (.csv)",
                    nextButton: { needShow: true, isDisable: true },
                    backButton: { needShow: true, isDisable: false },
                    fields: [{
                        type: OptionType.fileLoader,
                        fieldLabel: "",
                        fileFormats: [".csv", ".svg"],
                        onDataChange: (value: File[], form: StepperDataStep) => {
                            if (value?.length) {
                                context.resultParams.mainFile = value[0];
                                form.isCompleted = true;
                            } else {
                                context.resultParams.mainFile = null;
                                form.isCompleted = false;
                            }
                            if (form.nextButton) {
                                form.nextButton.isDisable = !value?.length;
                            }
                            this.updateResultParams(context.resultParams);
                        },
                    },
                    ],
                },

                ////////////////////////////////////////////////////////////////////
                {
                    stepLabel: "Итог",
                    nextButton: { needShow: false, isDisable: false },
                    resetButton: { needShow: true, isDisable: false },
                    backButton: { needShow: true, isDisable: false },
                    actionButton: { needShow: true, isDisable: false },
                    checkbox: {
                        needShow: true,
                        isDisable: false,
                        text: "Развернуть микросервис после обновления базы",
                        value: false,
                        action: (value: boolean, form: StepperDataStep) => {
                            context.resultParams.needDeploy = value;
                            this.updateResultParams(context.resultParams);
                        }
                    },
                    isCompleted: context.resultParams.isComplete,
                    fields: this.finalOptions,
                    actionButtonAction: context.onFinish.bind(context),
                },
                ////////////////////////////////////////////////////////////////////
            ],
        };

        return stepperModel;
    }

    public update(resultParams: FormBaseResultParams) {
        this.updateResultParams(resultParams);
    }

    protected toFinalData(resultParams: FormBaseResultParams): StepperLabelField[] {
        return [{
            type: OptionType.label,
            fieldLabel: "Вид базы:",
            text: resultParams.baseTypeName ?? "не выбран тип НБ",
        }, {
            type: OptionType.label,
            fieldLabel: "Формулы для нормативной базы:",
            text: resultParams.baseChoice?.name ?? "не выбрана база",
        }, {
            type: OptionType.label,
            fieldLabel: "Файл c формулами:",
            text: resultParams.mainFile?.name ?? "не выбран файл",
        },
        ]
    }

    protected toSelectorBaseOptions(baseData: AvailableBaseAdditionInfo[]): SelectorOption<AvailableBaseAdditionInfo>[] {
        const selectorOptions: SelectorOption<AvailableBaseAdditionInfo>[] = [];
        baseData.forEach(x => {
            selectorOptions.push({
                isAvailable: true,
                value: x.name,
                data: x,
                action: () => {
                }
            });
        });
        return selectorOptions;
    }
}