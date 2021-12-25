import { Injectable } from "@angular/core";
import { OptionType, SelectorOption, StepperData, StepperDataStep, StepperSelectorField, StepFields, StepperLabelField } from "src/app/secondary-module/stepper/models/stepper-model";
import { BaseType, NormativeBaseInfo } from "src/app/shared/models/server-models/normative-base-info";
import { BaseDeclarationService } from "../../models/declaration-base.service";
import { FormulaBaseComponent } from "../formula-base.component";
import { BaseTypeInfo, FormBaseResultParams } from "../models/form-base.models";
import { FormulaBaseEndpointService } from "./formula-base.endpoint.service";


@Injectable()
export class FormulaBaseDeclarationService extends BaseDeclarationService<FormBaseResultParams> {
    normBaseFieldOptions: SelectorOption<NormativeBaseInfo>[] = [];
    finalOptions: StepFields[] = [];
    constructor(private endpoint: FormulaBaseEndpointService) {
        super();
    }

    public getStepperModel(context: FormulaBaseComponent): StepperData {
        const stepperModel: StepperData = {
            isLinear: true,
            steps: [
                {
                    stepLabel: "Выбор вида НБ",
                    nextButton: { needShow: true, isDisable: true },
                    isAwaiting: false,
                    fields: [{
                        type: OptionType.selector,
                        fieldLabel: "Доступные виды нормативных баз",
                        onDataChange: async (value: SelectorOption<BaseTypeInfo>, step: StepperDataStep) => {
                            const data = value.data as BaseTypeInfo;
                            context.resultParams.baseTypeName = data.name;
                            step.isAwaiting = true;

                            const availableNB = await this.endpoint.getAvailableNormativeBases(data.type);
                            if (!availableNB) {
                                step.isAwaiting = false;
                                step.isCompleted = false;
                                return;
                            }
                            this.normBaseFieldOptions.splice(0);
                            this.normBaseFieldOptions.push(...this.toSelectorOptions(availableNB));

                            step.isAwaiting = false;
                            step.isCompleted = true;
                            if (step.nextButton) {
                                step.nextButton.isDisable = false;
                            }
                            this.updateResultParams(context.resultParams);

                        },
                        fieldOptions: [{
                            isAvailable: true,
                            value: "ТСН МГЭ",
                            data: { type: BaseType.TSN_MGE, name: "ТСН МГЭ" },
                            action: () => { }
                        }, {
                            isAvailable: true,
                            value: "ТСН МГЭ глава 13",
                            data: { type: BaseType.TSN_MGE_13, name: "ТСН МГЭ. глава 13" },
                            action: () => { }
                        }, {
                            isAvailable: false,
                            value: "ФЕР",
                            data: { type: BaseType.FER, name: "ФЕР" },
                            action: () => { }
                        }]
                    }],
                },
                ////////////////////////////////////////////////////////////////////
                {
                    stepLabel: "Выбор НБ",
                    nextButton: { needShow: true, isDisable: true },
                    backButton: { needShow: true, isDisable: false },
                    fields: [{
                        type: OptionType.selector,
                        fieldLabel: "Доступные НБ",
                        onDataChange: (value: SelectorOption<NormativeBaseInfo>, form: StepperDataStep) => {
                            context.resultParams.normBaseChoice = value.data as NormativeBaseInfo;

                            if (form.nextButton) {
                                form.nextButton.isDisable = false;
                            }
                            form.isCompleted = true;
                            this.updateResultParams(context.resultParams);
                        },
                        fieldOptions: this.normBaseFieldOptions,
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
                                context.resultParams.file = value[0];
                                form.isCompleted = true;
                            } else {
                                context.resultParams.file = null;
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
                        checkboxAction: (value: boolean, form: StepperDataStep) => {
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

    protected toFinalData(resultParams: FormBaseResultParams): StepperLabelField[] {
        return [{
            type: OptionType.label,
            fieldLabel: "Вид базы:",
            text: resultParams.baseTypeName ?? "не выбран тип НБ",
        }, {
            type: OptionType.label,
            fieldLabel: "Формулы для нормативной базы:",
            text: resultParams.normBaseChoice?.name ?? "не выбрана база",
        }, {
            type: OptionType.label,
            fieldLabel: "Файл c формулами:",
            text: resultParams.file?.name ?? "не выбран файл",
        },
        ]
    }

    private toSelectorOptions(baseData: NormativeBaseInfo[]): SelectorOption<NormativeBaseInfo>[] {
        const selectorOptions: SelectorOption<NormativeBaseInfo>[] = [];
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