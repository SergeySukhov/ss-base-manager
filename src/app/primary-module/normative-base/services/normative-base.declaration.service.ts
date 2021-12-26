import { Injectable } from "@angular/core";
import { OptionType, SelectorOption, StepperData, StepperDataStep, StepperSelectorField, StepFields, StepperLabelField } from "src/app/secondary-module/stepper/models/stepper-model";
import { BaseType, NormativeBaseInfo } from "src/app/shared/models/server-models/normative-base-info";
import { v4 } from "uuid";
import { BaseTypeInfo } from "../../formula-base/models/form-base.models";
import { DeclarationBaseService } from "../../models/declaration-base.service";
import { NormBaseResultParams } from "../models/norm-base.models";
import { NormativeBaseComponent } from "../normative-base.component";
import { NormativeBaseEndpointService } from "./normative-base.endpoint.service";
import { NormativeBaseStateService } from "./normative-base.state.service";

@Injectable()
export class NormativeBaseDeclarationService extends DeclarationBaseService<NormBaseResultParams> {
    normBaseFieldOptions: SelectorOption<NormativeBaseInfo>[] = [];

    constructor(private endpoint: NormativeBaseEndpointService, private stateService: NormativeBaseStateService) {
        super();
    }

    public getStepperModel(context: NormativeBaseComponent): StepperData {
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

                            this.setAddBaseForm(!!value.imgSrc, context, form);

                            if (form.nextButton) {
                                form.nextButton.isDisable = !context.resultParams.normBaseChoice;;
                            }
                            form.isCompleted = !form.nextButton?.isDisable
                            this.updateResultParams(context.resultParams);
                        },
                        fieldOptions: this.normBaseFieldOptions,
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
                                context.resultParams.fileNormatives = value[0];
                                form.isCompleted = true;
                            } else {
                                context.resultParams.fileNormatives = null;
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
                    actionButtonAction: context.onFinish.bind(context),
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
            text: resultParams.baseTypeName ?? "не выбран тип НБ",
        }, {
            type: OptionType.label,
            fieldLabel: resultParams.addBase ? "Новая нормативная" : "Нормативная база:",
            text: resultParams.addBase?.name ?? resultParams.normBaseChoice?.name ?? "не выбрана база",
        }, {
            type: OptionType.label,
            fieldLabel: "Файл c нормативами:",
            text: resultParams.fileNormatives?.name ?? "не выбран файл",
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
        if (resultParams.addBase) {
            const addInfo: StepperLabelField = {
                type: OptionType.label,
                fieldLabel: "Файл c техчастями:",
                text: resultParams.fileTechDocs?.name ?? "не выбран файл (необязательно)",
            };

            resultInfoFields.splice(2, 0, addInfo);
        }
        return resultInfoFields;
    }

    private toSelectorOptions(baseData: NormativeBaseInfo[]): SelectorOption<NormativeBaseInfo>[] {
        const selectorOptions: SelectorOption<NormativeBaseInfo>[] = [];
        selectorOptions.push({
            isAvailable: true,
            imgSrc: "assets\\icons\\add.svg",
            value: "",
            data: {},
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

    private setAddBaseForm(needAddForm: boolean, context: NormativeBaseComponent, form: StepperDataStep) {
        if (needAddForm) {
            context.resultParams.addBase = {
                guid: v4(),
                name: "",
            }
            context.resultParams.normBaseChoice = null;
            form.stepLabel = "Добавление новой НБ"
            form.fields.push(
                {
                    type: OptionType.label,
                    text: context.resultParams.addBase.guid,
                    fieldLabel: "Идентификатор добаляемой НБ",
                    onDataChange: () => { }
                }, {
                type: OptionType.input,
                fieldLabel: "Наименование НБ",
                placeHolder: "",
                onDataChange: (value: string, form: StepperDataStep) => {
                    console.log("!! | setAddBaseForm | value", value)
                    if (context.resultParams.addBase) {
                        context.resultParams.addBase.name = value;
                        if (form.nextButton) {
                            form.nextButton.isDisable = !value;
                        }
                        form.isCompleted = !!value;
                    }
                }

            },
                // {
                //     type: OptionType.input,
                //     fieldLabel: "Дополнение",
                //     placeHolder: "",
                //     onDataChange: (value: string) => {
                //         if (context.resultParams.addBase) {
                //             context.resultParams.addBase.name = value;
                //         }
                //     }

                // },
            )
        } else {
            form.stepLabel = "Выбор НБ"
            context.resultParams.addBase = undefined;
            form.fields.splice(1);
        }
        return;
    }
}