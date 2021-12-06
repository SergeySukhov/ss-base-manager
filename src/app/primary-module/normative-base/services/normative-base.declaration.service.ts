import { Injectable } from "@angular/core";
import { OptionType, SelectorOption, StepperData, StepperDataStep, StepperSelectorField, StepFields } from "src/app/secondary-module/stepper/models/stepper-model";
import { NormativeBaseComponent } from "../normative-base.component";
import { NormativeBaseEndpointService } from "./normative-base.endpoint.service";

@Injectable()
export class NormativeBaseDeclarationService {

    sm: StepperData | undefined;

    constructor(private endpoint: NormativeBaseEndpointService) {

    }

    public async getStepperModel(context: NormativeBaseComponent): Promise<StepperData> {
        const stepperModel: StepperData = {
            steps: [{
                stepLabel: "Выбор вида НБ",
                needNextButton: false,
                isAwaiting: false,
                fields: [{
                    type: OptionType.selector,
                    fieldLabel: "Доступные виды нормативных баз",
                    onDataChange: async (value: string, step: StepperDataStep) => {
                        context.resultParams.baseType = value;
                        if (!step) {
                            return;
                        }
                        step.isAwaiting = true;
                        const loadedBase = await this.endpoint.testGetData();
                        step.isAwaiting = false;
                        step.needNextButton = true;
                        stepperModel.steps.push(this.getInstalledBase(context, loadedBase));
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
            ],
        };
        this.sm = stepperModel;

        return stepperModel;
    }


    private getInstalledBase(context: NormativeBaseComponent, availableBases: string[]): StepperDataStep {
        const a: StepperDataStep = {
            stepLabel: "Выбор НБ",
            needNextButton: false,
            // needResetButton: true,
            needBackButton: true,
            fields: [{
                type: OptionType.selector,
                fieldLabel: "Установленные НБ",
                onDataChange: (value: any, form?: StepperDataStep) => {
                    const selectedOption: SelectorOption = value.value;
                    const needAdd = !!selectedOption.imgSrc;
                    if (form) {
                        form.needNextButton = true;
                    }
                    this.setAddForm(needAdd, context, form);
                    this.sm?.steps.push(this.getFileLoader(context));
                },
                fieldOptions: [{ // опция создания нового микросервиса НБ
                    isAvailable: true,
                    value: "",
                    imgSrc: "assets/icons/add.svg",
                    action: (value: string, form: StepperDataStep) => {
                    }
                },
                // редактирование существующих НБ
                ...this.toSelectOptions(availableBases, context)],
            },
            ],
        }
        return a;
    }

    private toSelectOptions(baseData: string[], context: NormativeBaseComponent): SelectorOption[] {
        const a: SelectorOption[] = [];
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

    private setAddForm(needAddForm: boolean, context: NormativeBaseComponent, form?: StepperDataStep) {
        if (needAddForm) {
            context.resultParams.addBase = {
                guid: "12313",
                name: "",
            }
            if (!!form?.fields) {
                form.fields.push({
                    type: OptionType.divider,
                    onDataChange: () => { }
                }, {
                    type: OptionType.label,
                    text: context.resultParams.addBase.guid,
                    fieldLabel: "context.resultParams.addBase.guid",
                    onDataChange: () => { }
                }, {
                    type: OptionType.input,
                    fieldLabel: "Наименование НБ",
                    placeHolder: "",
                    onDataChange: (value) => {
                        console.log("!! | setAddForm | value", value)
                        if (context.resultParams.addBase) {
                            context.resultParams.addBase.name = value;
                        }
                    }
                }, {
                    type: OptionType.divider,
                    onDataChange: () => { }
                },)
            }
        } else {
            context.resultParams.addBase = undefined;
            if (form?.fields) {
                form.fields.splice(1);
            }
        }
        return

    }

    private getFileLoader(context: NormativeBaseComponent,) {
        const a: StepperDataStep = {
            stepLabel: "Добавление файла",
            needNextButton: false,
            // needResetButton: true,
            needBackButton: true,
            fields: [{
                type: OptionType.fileLoader,
                fieldLabel: "",
                onDataChange: (value: any, form?: StepperDataStep) => {
                    console.log("!! | getFileLoader | value", value)
                   
                },
            },
            ],
        }
        return a;
    }
}