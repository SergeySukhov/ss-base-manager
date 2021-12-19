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
                needNextButton: false,
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
                        if (form) {
                            form.needNextButton = true;
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
                stepLabel: "Добавление файла тех. части",
                needNextButton: false,
                // needResetButton: true,
                needBackButton: true,
                fields: [{
                    type: OptionType.fileLoader,
                    fieldLabel: "",
                    onDataChange: (value: any, form: StepperDataStep) => {
                        console.log("!! | getFileLoader | value", value)
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