import { Injectable } from "@angular/core";
import { MatSelectChange } from "@angular/material/select";
import { OptionType, SelectorOption, StepperData, StepperDataStep, StepperSelectorField, StepFields } from "src/app/secondary-module/stepper/models/stepper-model";
import { NormativeBaseInfo } from "src/app/shared/models/server-models/normative-base-info";
import { FormulaBaseComponent } from "../formula-base.component";
import { FormBaseResultParams } from "../models/form-base.models";
import { FormulaBaseEndpointService } from "./formula-base.endpoint.service";


@Injectable()
export class FormulaBaseDeclarationService {
    normBasefieldOptions: SelectorOption[] = [];
    finalOptions: StepFields[] = [];
    constructor(private endpoint: FormulaBaseEndpointService) {
    }

    public getStepperModel(context: FormulaBaseComponent): StepperData {
        const stepperModel: StepperData = {
            isLinear: true,
            steps: [  {
                stepLabel: "Добавление файла формул (.csv)",
                nextButton: { needShow: true, isDisable: true },
                backButton: { needShow: true, isDisable: false },
                checkbox: {
                    needShow: true,
                    isDisable: false,
                    text: "Деплой",
                    value: false,
                    checkboxAction: (value: boolean, form: StepperDataStep) => {
                        context.resultParams.needDeploy = value;
                    }
                },
                fields: [{
                    type: OptionType.fileLoader,
                    fieldLabel: "",
                    fileFormats: ["csv", "svg"],
                    onDataChange: (value: File[], form: StepperDataStep) => {
                        console.log("!! | getStepperModel | value", value)
                        context.resultParams.file = value[0];
                        form.isCompleted = true;
                        if (form.nextButton) {
                            form.nextButton.isDisable = false;
                        }
                        this.finalOptions.splice(0);
                        this.finalOptions.push(...this.toFinalData(context.resultParams))
                    },
                },
                ],
            },
            {
                stepLabel: "Выбор вида НБ",
                nextButton: { needShow: true, isDisable: true },
                isAwaiting: false,
                fields: [{
                    type: OptionType.selector,
                    fieldLabel: "Доступные виды нормативных баз",
                    onDataChange: async (value: MatSelectChange, step: StepperDataStep) => {
                        context.resultParams.baseType = value.value.value;
                        step.isAwaiting = true;

                        const availableNB = await this.endpoint.getAvailableNormativeBases();
                        if (!availableNB) {
                            step.isAwaiting = false;
                            step.isCompleted = false;
                            return;
                        }
                        this.normBasefieldOptions.splice(0);
                        this.normBasefieldOptions.push(...this.toSelectorOptions(availableNB));

                        step.isAwaiting = false;
                        step.isCompleted = true;
                        if (step.nextButton) {
                            step.nextButton.isDisable = false;
                        }
                    },
                    fieldOptions: [{
                        isAvailable: true,
                        value: "ТСН МГЭ",
                        action: () => { }
                    }, {
                        isAvailable: false,
                        value: "ФЕР",
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
                    onDataChange: (value: any, form: StepperDataStep) => {
                        console.log("!! | getStepperModel | value", value)
                        const selectedOption: SelectorOption = value.value;

                        context.resultParams.normBaseChoice = selectedOption.data;

                        if (form.nextButton) {
                            form.nextButton.isDisable = false;
                        }
                        form.isCompleted = true;
                    },
                    fieldOptions: this.normBasefieldOptions,
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
                    fileFormats: ["csv", "svg"],
                    onDataChange: (value: File[], form: StepperDataStep) => {
                        console.log("!! | getStepperModel | value", value)
                        context.resultParams.file = value[0];
                        form.isCompleted = true;
                        if (form.nextButton) {
                            form.nextButton.isDisable = false;
                        }
                        this.finalOptions.splice(0);
                        this.finalOptions.push(...this.toFinalData(context.resultParams))
                    },
                },
                ],
            },

            ////////////////////////////////////////////////////////////////////
            {
                stepLabel: "Итог",
                nextButton:  { needShow: false, isDisable: false },
                resetButton:  { needShow: true, isDisable: false },
                backButton:  { needShow: true, isDisable: false },
                actionButton:  { needShow: true, isDisable: false },
                isCompleted: !!this.finalOptions.length,
                fields: this.finalOptions,
                actionButtonAction: context.onFinish.bind(context),
            },

                ////////////////////////////////////////////////////////////////////
            ],
        };

        return stepperModel;
    }

    private toSelectorOptions(baseData: NormativeBaseInfo[]): SelectorOption[] {
        const selectorOptions: SelectorOption[] = [];
        baseData.forEach(x => {
            selectorOptions.push({
                isAvailable: true,
                value: x.name,
                data: x,
                action: (value: SelectorOption, form: StepperDataStep) => {

                }
            });
        });
        return selectorOptions;
    }

    private toFinalData(resultParams: FormBaseResultParams): StepFields[] {
        return [{
            type: OptionType.label,
            fieldLabel: "Вид базы:",
            text: resultParams.baseType,
        }, {
            type: OptionType.label,
            fieldLabel: "Формулы для нормативной базы:",
            text: resultParams.normBaseChoice?.name ?? "!! не выбрана база !!",
        }, {
            type: OptionType.label,
            fieldLabel: "Файл c формулами:",
            text: resultParams.file?.name ?? "!! не выбран файл !!",
        },
        ]
    }
}