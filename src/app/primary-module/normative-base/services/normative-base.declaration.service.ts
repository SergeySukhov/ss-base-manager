import { Injectable } from "@angular/core";
import { DeclarationBaseService } from "src/app/core/services/base-services/declaration-base.service";
import { OptionType, SelectorOption, StepperData, StepperDataStep, StepperSelectorField, StepFields, StepperLabelField } from "src/app/secondary-module/stepper/models/stepper-model";
import { AvailableBaseAdditionInfo } from "src/app/shared/models/server-models/AvailableBaseAdditionInfo";
import { AvailableNormativeBaseType, BaseType } from "src/app/shared/models/server-models/AvailableNormativeBaseType";
import { v4 } from "uuid";
import { NormBaseResultParams } from "../models/norm-base.models";
import { NormativeBaseComponent } from "../normative-base.component";
import { NormativeBaseEndpointService } from "./normative-base.endpoint.service";

@Injectable()
export class NormativeBaseDeclarationService extends DeclarationBaseService<AvailableBaseAdditionInfo, NormBaseResultParams> {
    additionalBase: AvailableBaseAdditionInfo;
    isAddFormSet = false;

    constructor(private endpoint: NormativeBaseEndpointService) {
        super();
        this.additionalBase = this.initAddAdditionalBase();
    }

    public getStepperModel(context: NormativeBaseComponent, avTypes: AvailableNormativeBaseType[]): StepperData {
        this.additionalBase = context.resultParams.addBase ?? this.initAddAdditionalBase();

        const stepperModel: StepperData = {
            isLinear: true,
            steps: [
                this.getBaseTypeStep(
                    avTypes,
                    context.resultParams,
                    this.endpoint.getAvailableNormativeBases.bind(this.endpoint)
                ),
                ////////////////////////////////////////////////////////////////////
                {
                    stepLabel: "Выбор НБ",
                    nextButton: { needShow: true, isDisable: !context.resultParams.baseChoice && !context.resultParams.addBase },
                    backButton: { needShow: true, isDisable: false },
                    fields: [{
                        type: OptionType.selector,
                        fieldLabel: "Доступные НБ",
                        fieldOptions: this.baseFieldOptions,
                        startOptionGet: (form: StepperDataStep) => {
                            if (context.resultParams.addBase && !this.isAddFormSet) {
                                setTimeout(() => {
                                    this.setAddBaseForm(true, context, form);
                                })
                                return this.baseFieldOptions[0];
                            }
                            return this.baseFieldOptions.find(x => x.data.guid === context.resultParams.baseChoice?.guid)
                        },
                        onDataChange: (value: SelectorOption<AvailableBaseAdditionInfo>, form: StepperDataStep) => {
                            if (!!value.imgSrc) {

                            } else {
                                context.resultParams.baseChoice = value.data as AvailableBaseAdditionInfo;
                            }
                            this.setAddBaseForm(!!value.imgSrc, context, form);
                            form.isCompleted = !!context.resultParams.addBase || !!context.resultParams.baseChoice;
                            form.nextButton ? form.nextButton.isDisable = !form.isCompleted : console.error("!!");

                            this.updateResultParams(context.resultParams);
                        },
                    },
                    ],
                },
                ////////////////////////////////////////////////////////////////////
                {
                    stepLabel: "Добавление файла нормативной базы (.xml)",
                    nextButton: { needShow: true, isDisable: true },
                    backButton: { needShow: true, isDisable: false },
                    fields: [{
                        type: OptionType.fileLoader,
                        fieldLabel: "",
                        fileFormats: [".xml",],
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
                {
                    stepLabel: "Добавление файла формул для НБ (.csv)",
                    nextButton: { needShow: true, isDisable: false },
                    backButton: { needShow: true, isDisable: false },
                    isOptional: true,
                    fields: [{
                        type: OptionType.fileLoader,
                        fieldLabel: "",
                        fileFormats: [".csv",],
                        onDataChange: (value: File[], form: StepperDataStep) => {
                            form.isCompleted = true;
                            if (value?.length) {
                                context.resultParams.fileFormuls = value[0];
                            } else {
                                context.resultParams.fileFormuls = null;
                            }
                            this.updateResultParams(context.resultParams);
                        },
                    },
                    ],
                },
                {
                    stepLabel: "Добавление файлов тех. частей (.zip)",
                    nextButton: { needShow: true, isDisable: false },
                    backButton: { needShow: true, isDisable: false },
                    isOptional: true,
                    fields: [{
                        type: OptionType.fileLoader,
                        fieldLabel: "",
                        fileFormats: [".zip"],
                        onDataChange: (value: File[], form: StepperDataStep) => {
                            form.isCompleted = true;
                            if (value?.length) {
                                context.resultParams.fileTechDocs = value[0];
                            } else {
                                context.resultParams.fileTechDocs = null;
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
                    actionButtonAction: () => {
                        context.onFinish();
                    }
                },
                ////////////////////////////////////////////////////////////////////
            ],
        };

        return stepperModel;
    }

    protected toFinalData(resultParams: NormBaseResultParams): StepperLabelField[] {
        const resultInfoFields: StepperLabelField[] = [{
            type: OptionType.label,
            fieldLabel: "Вид базы:",
            text: this.baseTypePipe.transform(resultParams.baseType) ?? "не выбран тип НБ",
        }, {
            type: OptionType.label,
            fieldLabel: resultParams.addBase ? "Новая нормативная база" : "Нормативная база:",
            text: resultParams.addBase?.name ?? resultParams.baseChoice?.name ?? "не выбрана база",
        }, {
            type: OptionType.label,
            fieldLabel: "Файл c нормативами:",
            text: resultParams.mainFile?.name ?? "не выбран файл",
        }, {
            type: OptionType.label,
            fieldLabel: "Файл c формулами:",
            text: resultParams.fileFormuls?.name ?? "не выбран файл (необязательно)",
        }, {
            type: OptionType.label,
            fieldLabel: "Файл c техчастями:",
            text: resultParams.fileTechDocs?.name ?? "не выбран файл (необязательно)",
        },
        ];
        return resultInfoFields;
    }

    protected toSelectorBaseOptions(baseData: AvailableBaseAdditionInfo[]): SelectorOption<AvailableBaseAdditionInfo>[] {
        const selectorOptions: SelectorOption<AvailableBaseAdditionInfo>[] = [];
        selectorOptions.push({
            isAvailable: true,
            imgSrc: "assets\\icons\\add.svg",
            value: "",
            data: this.additionalBase,
            action: () => {
            }
        });
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

    private initAddAdditionalBase(): AvailableBaseAdditionInfo {
        return {
            guid: v4(),
            isAvailable: true,
            isCancelled: false,
            additionRegexp: "",
            name: "новая база",
            shortName: "",
            parentBaseType: undefined,
            type: BaseType.TSN_MGE,
            additionNumber: 1,
        }
    }

    private setAddBaseForm(needAddForm: boolean, context: NormativeBaseComponent, form: StepperDataStep) {
        if (needAddForm ) {
            if (this.isAddFormSet) {
                return;
            }
            this.isAddFormSet = true;
            this.additionalBase.guid = v4();
            context.resultParams.addBase = this.additionalBase;
            form.isCompleted = true;
            form.nextButton = { isDisable: false, needShow: true }
            form.stepLabel = "Добавление новой НБ"
            form.fields.push({
                type: OptionType.label,
                text: this.additionalBase.guid,
                fieldLabel: "Идентификатор добавляемой НБ",
                onDataChange: () => { }
            }, {
                type: OptionType.input,
                fieldLabel: "Наименование НБ",
                initValue: this.additionalBase.name,
                placeHolder: "",
                onDataChange: (value: string, form: StepperDataStep) => {
                    this.additionalBase.name = value;
                    this.updateResultParams(context.resultParams);
                }
            }, {
                type: OptionType.input,
                fieldLabel: "Краткое наименование НБ",
                placeHolder: "",
                initValue: this.additionalBase.shortName,
                onDataChange: (value: string, form: StepperDataStep) => {
                    this.additionalBase.shortName = value;
                    this.updateResultParams(context.resultParams);
                }
            }, {
                type: OptionType.input,
                fieldLabel: "Номер дополнения",
                inputType: "number",
                initValue: this.additionalBase.additionNumber,
                placeHolder: "",
                onDataChange: (value: string) => {
                    this.additionalBase.additionNumber = Number.parseInt(value) ?? 1;
                    this.updateResultParams(context.resultParams);
                }

            }, {
                type: OptionType.input,
                fieldLabel: "Регулярное выражение",
                initValue: this.additionalBase.additionNumber,
                placeHolder: "",
                onDataChange: (value: string) => {
                    this.additionalBase.additionRegexp = value;
                    this.updateResultParams(context.resultParams);
                }

            },
            )
        } else {
            this.isAddFormSet = false;
            form.stepLabel = "Выбор НБ";
            context.resultParams.addBase = undefined;
            form.fields.splice(1);
        }
        return;
    }
}