import { Injectable } from "@angular/core";
import { OptionType, SelectorOption, StepperData, StepperDataStep, StepperSelectorField, StepFields } from "src/app/secondary-module/stepper/models/stepper-model";
import { NormativeBaseComponent } from "../normative-base.component";
import { NormativeBaseEndpointService } from "./normative-base.endpoint.service";
import { NormativeBaseStateService } from "./normative-base.state.service";

@Injectable()
export class NormativeBaseDeclarationService {
    normBasefieldOptions: SelectorOption[] = [];

    constructor(private endpoint: NormativeBaseEndpointService, private stateService: NormativeBaseStateService) {

    }

    public getStepperModel(context: NormativeBaseComponent): StepperData {
        const stepperModel: StepperData = {
            isLinear: true,
            steps: [{
                stepLabel: "Выбор вида НБ",
                // nextButton: false,
                isAwaiting: false,
                fields: [{
                    type: OptionType.selector,
                    fieldLabel: "Доступные виды нормативных баз",
                    onDataChange: async (value: string, step: StepperDataStep) => {
                        context.resultParams.baseType = value;
                        step.isAwaiting = true;

                        const availableNB = await this.endpoint.testGetData();

                        this.normBasefieldOptions.splice(0);
                        this.normBasefieldOptions.push(...this.toSelectorOptions(availableNB));

                        step.isAwaiting = false;
                        step.isCompleted = true;
                        // step.nextButton = true;
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
                // nextButton: false,
                // backButton: true,
                fields: [{
                    type: OptionType.selector,
                    fieldLabel: "Доступные НБ",
                    onDataChange: (value: any, form: StepperDataStep) => {
                        const selectedOption: SelectorOption = value.value;
                        const needAdd = !!selectedOption.imgSrc;
                        if (form) {
                            // form.nextButton = true;
                        }
                        this.setAddBaseForm(needAdd, context, form);
                        form.isCompleted = true;
                    },
                    fieldOptions: this.normBasefieldOptions,
                },
                ],
            },
            ////////////////////////////////////////////////////////////////////
            {
                stepLabel: "Добавление файла НБ",
                // nextButton: false,
                // needResetButton: true,
                // backButton: true,
                fields: [{
                    type: OptionType.fileLoader,
                    fieldLabel: "",
                    onDataChange: (value: any, form: StepperDataStep) => {
                        form.isCompleted = true;
                        // form.nextButton = true;
                    },
                },
                ],
            },

            ////////////////////////////////////////////////////////////////////
            {
                stepLabel: "Добавление файла тех. части",
                // nextButton: false,
                // // needResetButton: true,
                // backButton: true,
                fields: [{
                    type: OptionType.fileLoader,
                    fieldLabel: "",
                    onDataChange: (value: any, form: StepperDataStep) => {
                        form.isCompleted = true;
                        // form.nextButton = true;
                    },
                },
                ],
            },
            ////////////////////////////////////////////////////////////////////
            {
                stepLabel: "Итог",
                // nextButton: false,
                // resetButton: true,
                // backButton: true,
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
            action: (value: SelectorOption, form: StepperDataStep) => {
            }
        });

        baseData.forEach(x => {
            a.push({
                isAvailable: true,
                value: x,
                action: () => {
                }
            });
        });
        return a;
    }


    private setAddBaseForm(needAddForm: boolean, context: NormativeBaseComponent, form: StepperDataStep) {
        if (needAddForm) {
            context.resultParams.addBase = {
                guid: "12313",
                name: "",
            }
            form.stepLabel = "Добавление новой НБ"
            if (!!form?.fields) {
                form.fields.push(
                //     {
                //     type: OptionType.divider,
                //     onDataChange: () => { }
                // }, 
                {
                    type: OptionType.label,
                    text: context.resultParams.addBase.guid,
                    fieldLabel: "Идентификатор добаляемой НБ",
                    onDataChange: () => { }
                }, {
                    type: OptionType.input,
                    fieldLabel: "Наименование НБ",
                    placeHolder: "",
                    onDataChange: (value) => {
                        if (context.resultParams.addBase) {
                            context.resultParams.addBase.name = value;
                        }
                    }
                },
                //  {
                //     type: OptionType.divider,
                //     onDataChange: () => { }
                // }
                )
            }
        } else {
            form.stepLabel = "Выбор НБ"

            context.resultParams.addBase = undefined;
            if (form?.fields) {
                form.fields.splice(1);
            }
        }
        return
    }
}