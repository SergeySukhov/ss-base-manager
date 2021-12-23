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
        const availableNB = this.endpoint.getAvailableNormativeBases().then(res => {
            console.log("!! | availableNB | res", res)

        });

    }

    public getStepperModel(context: FormulaBaseComponent): StepperData {
        const stepperModel: StepperData = {
            isLinear: true,
            steps: [{
                stepLabel: "Выбор вида НБ",
                needNextButton: false,
                isAwaiting: false,
                fields: [{
                    type: OptionType.selector,
                    fieldLabel: "Доступные виды нормативных баз",
                    onDataChange: async (value: MatSelectChange, step: StepperDataStep) => {
                        context.resultParams.baseType = value.value.value;
                        step.isAwaiting = true;

                        const availableNB = await this.endpoint.getAvailableNormativeBases();

                        this.normBasefieldOptions.splice(0);
                        this.normBasefieldOptions.push(...this.toSelectorOptions(availableNB));
                        
                        step.isAwaiting = false;
                        step.isCompleted = true;
                        step.needNextButton = true;
                    },
                    fieldOptions: [{
                        isAvailable: true,
                        value: "ТСН МГЭ",
                        action: (value: string) => { }
                    }, {
                        isAvailable: false,
                        value: "ФЕР",
                        action: (value: string) => { }
                    }]
                }],
            },
            ////////////////////////////////////////////////////////////////////
            {
                stepLabel: "Выбор НБ",
                needNextButton: false,
                needBackButton: true,
                fields: [{
                    type: OptionType.selector,
                    fieldLabel: "Доступные НБ",
                    onDataChange: (value: any, form: StepperDataStep) => {
                        const selectedOption: SelectorOption = value.value;

                        context.resultParams.normBaseChoice = selectedOption.data.name;

                        form.needNextButton = true;
                        form.isCompleted = true;
                    },
                    fieldOptions: this.normBasefieldOptions,
                },
                ],
            },
            ////////////////////////////////////////////////////////////////////
            {
                stepLabel: "Добавление файла формул (.csv)",
                needNextButton: false,
                needBackButton: true,
                fields: [{
                    type: OptionType.fileLoader,
                    fieldLabel: "",
                    onDataChange: (value: File[], form: StepperDataStep) => {
                    console.log("!! | getStepperModel | value", value)
                        context.resultParams.file = value[0];
                        context.resultParams.fileLocation = value[0].name;
                        form.isCompleted = true;
                        form.needNextButton = true;
                        this.finalOptions.splice(0);
                        this.finalOptions.push(...this.toFinalData(context.resultParams))
                    },
                },
                ],
            },

            ////////////////////////////////////////////////////////////////////
            {
                stepLabel: "Итог",
                needNextButton: false,
                needResetButton: false,
                needBackButton: false,
                needActionButton: true,
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
        const a: SelectorOption[] = [];
        // a.push({ // опция создания нового микросервиса формул
        //     isAvailable: true,
        //     value: "",
        //     // data: {}
        //     imgSrc: "assets/icons/add.svg",
        //     action: (value: string, form: StepperDataStep) => {
        //     }
        // });

        baseData.forEach(x => {
            a.push({
                isAvailable: true,
                value: x.name,
                data: x,
                action: (value: string, form: StepperDataStep) => {

                }
            });
        });
        return a;
    }

    private toFinalData(resultParams: FormBaseResultParams): StepFields[] {
        return [{
            type: OptionType.label,
            fieldLabel: "Вид базы",
            text: resultParams.baseType,
        },{
            type: OptionType.label,
            fieldLabel: "Формулы для нормативной базы",
            text: resultParams.normBaseChoice,
        },{
            type: OptionType.label,
            fieldLabel: "Файл",
            text: resultParams.file?.name ?? "",
        },
        ]
    }
}