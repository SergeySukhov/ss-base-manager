import { Injectable } from "@angular/core";
import { OptionType, SelectorOption, StepperData, StepperDataStep, StepperSelectorField, StepFields } from "src/app/secondary-module/stepper/models/stepper-model";
import { FormulaBaseComponent } from "../formula-base.component";
import { FormulaBaseEndpointService } from "./formula-base.endpoint.service";


@Injectable()
export class FormulaBaseDeclarationService {
    normBasefieldOptions: SelectorOption[] = [];

    constructor(private endpoint: FormulaBaseEndpointService) {
        const availableNB = this.endpoint.getAvailableNB().then(res => {
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
                    onDataChange: async (value: string, step: StepperDataStep) => {
                        context.resultParams.baseType = value;
                        step.isAwaiting = true;

                        const availableNB = await this.endpoint.getAvailableNB();

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
                        const needAdd = !!selectedOption.imgSrc;
                        
                        form.needNextButton = true;
                        // this.setAddBaseForm(needAdd, context, form);
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
                // needResetButton: true,
                needBackButton: true,
                fields: [{
                    type: OptionType.fileLoader,
                    fieldLabel: "",
                    onDataChange: (value: any, form: StepperDataStep) => {
                        form.isCompleted = true;
                        form.needNextButton = true;
                    },
                },
                ],
            },

            ////////////////////////////////////////////////////////////////////
            {
                stepLabel: "Итог",
                needNextButton: false,
                needResetButton: true,
                needBackButton: true,
                isCompleted: true,
                fields: [{
                    type: OptionType.input,
                    fieldLabel: "",
                    onDataChange: (value: any, form: StepperDataStep) => {
                    },
                },
                ],
            },

                ////////////////////////////////////////////////////////////////////
            ],
        };

        return stepperModel;
    }

    private toSelectorOptions(baseData: string[]): SelectorOption[] {
        const a: SelectorOption[] = [];
        a.push({ // опция создания нового микросервиса НБ
            isAvailable: true,
            value: "",
            imgSrc: "assets/icons/add.svg",
            action: (value: string, form: StepperDataStep) => {
            }
        });

        baseData.forEach(x => {
            a.push({
                isAvailable: true,
                value: x,
                action: (value: string, form: StepperDataStep) => {
                }
            });
        });
        return a;
    }
}