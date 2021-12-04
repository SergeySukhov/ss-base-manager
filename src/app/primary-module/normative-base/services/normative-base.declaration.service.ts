import { Injectable } from "@angular/core";
import { OptionType, SelectorOption, StepperData, StepperDataStep, StepperSelectorField, StpFields } from "src/app/secondary-module/stepper/models/stepper-model";
import { NormativeBaseComponent } from "../normative-base.component";
import { NormativeBaseEndpointService } from "./normative-base.endpoint.service";

@Injectable()
export class NormativeBaseDeclarationService {

    constructor(private endpoint: NormativeBaseEndpointService) {

    }

    public async getStepperModel(context: NormativeBaseComponent): Promise<StepperData> {
        const stepperModel: StepperData = {
            steps: [{
                stepLabel: "Выбор вида НБ",
                needNextButton: true,
                isAwaiting: false,
                fields: [{
                    type: OptionType.selector,
                    fieldLabel: "Доступные виды нормативных баз",
                    onDataChange: async (value: string, step: StepperDataStep) => {
                        console.log("!! | getStepperModel | value", value)
                        context.resultParams.baseType = value;
                        if (!step) {
                            return;
                        }
                        step.isAwaiting = true;
                        const loadedBase = await this.endpoint.testGetData();
                        step.isAwaiting = false;
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


        return stepperModel;
    }


    private getInstalledBase(context: NormativeBaseComponent, availableBases: string[]): StepperDataStep {
        const a: StepperDataStep = {
            stepLabel: "Выбор НБ",
            needNextButton: true,
            needResetButton: true,
            fields: [{
                type: OptionType.selector,
                fieldLabel: "Установленные НБ",
                onDataChange: (value: any, form?: StepperDataStep) => {
                console.log("!! | getInstalledBase | value", value)
                    const selectedOption: SelectorOption = value.value;
                    const needAdd = !!selectedOption.imgSrc;
                    this.setAddForm(needAdd, context, form)
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
                    type: OptionType.label,
                    text: context.resultParams.addBase.guid,
                    fieldLabel: context.resultParams.addBase.guid,
                    onDataChange: () => { }
                }, {
                    type: OptionType.input,
                    fieldLabel: "Наименование НБ",
                    onDataChange: (value) => {
                        console.log("!! | setAddForm | value", value)
                        if (context.resultParams.addBase) {
                            context.resultParams.addBase.name = value;
                        }
                    }
                })
            }
        } else {
            context.resultParams.addBase = undefined;
            if (form?.fields) {
                form.fields.splice(1);
            }
        }
        return

    }
}