import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { BaseTypePipe } from "src/app/core/pipes/base-type.pipe";
import { OptionType, SelectorOption, StepFields, StepperData, StepperDataStep, StepperLabelField } from "src/app/secondary-module/stepper/models/stepper-model";
import { AvailableNormativeBaseType } from "src/app/shared/models/server-models/AvailableNormativeBaseType";
import { BaseTypeInfo } from "../../formula-base/models/form-base.models";
import { MultipleUploadResultParams, UploadBaseType } from "../models/multiple-upload-result-params.model";
import { MultipleUploaderComponent } from "../multiple-uploader.component";
import { MultipleUploaderEndpointService } from "./multiple-uploader.endpoint.service";

@Injectable()
export class MultipleUploaderDeclarationService {

    public updateParamsSub = new Subject<MultipleUploadResultParams>();

    protected finalOptions: StepFields[] = [];

    protected baseTypePipe = new BaseTypePipe();

    constructor(private endpoint: MultipleUploaderEndpointService) {
    }

    public getStepperModel(context: MultipleUploaderComponent, avTypes: AvailableNormativeBaseType[]): StepperData {
        console.log("!! | getStepperModel | avTypes", context.resultParams)

        const stepperModel: StepperData = {
            isLinear: true,
            steps: [{
                stepLabel: "Выбор вида НБ",
                nextButton: { needShow: true, isDisable: !context.resultParams.baseType },
                isCompleted: !!context.resultParams.baseType,
                isAwaiting: false,
                fields: [{
                    fieldOptions: this.toSelectorBaseTypeOptions(avTypes),
                    type: OptionType.selector,
                    fieldLabel: "Доступные виды нормативных баз",
                    onDataChange: async (value: SelectorOption<BaseTypeInfo>, form: StepperDataStep) => {
                        context.resultParams.baseType = value.data;
                        form.isCompleted = !!context.resultParams.baseType;
                        form.nextButton ? form.nextButton.isDisable = !form.isCompleted : console.error("!!");

                        this.updateResultParams(context.resultParams);
                    },
                }],
            },
            ////////////////////////////////////////////////////////////////////
            {
                stepLabel: "Выбор категории баз",
                nextButton: { needShow: true, isDisable: !context.resultParams.uploadType },
                isCompleted: !!context.resultParams.uploadType,
                isAwaiting: false,
                fields: [{
                    fieldOptions: this.toSelectorBaseCategoryOptions(),
                    type: OptionType.selector,
                    startOption: this.toSelectorBaseCategoryOptions().find(x => x.data === context.resultParams.uploadType),
                    fieldLabel: "Доступные категории нормативных баз",
                    onDataChange: async (value: SelectorOption<UploadBaseType>, form: StepperDataStep) => {
                        context.resultParams.uploadType = value.data;
                        form.isCompleted = !!context.resultParams.uploadType;
                        form.nextButton ? form.nextButton.isDisable = !form.isCompleted : console.error("!!");

                        this.updateResultParams(context.resultParams);
                    },
                }],
            },
            ////////////////////////////////////////////////////////////////////
            {
                stepLabel: "Добавление файлов",
                nextButton: { needShow: true, isDisable: true },
                backButton: { needShow: true, isDisable: false },
                fields: [{
                    type: OptionType.fileLoader,
                    fieldLabel: "",
                    isMultiple: true,
                    // fileFormats: [".csv", ".svg"],
                    onDataChange: (value: File[], form: StepperDataStep) => {
                        if (value?.length) {
                            context.resultParams.files = value;
                            form.isCompleted = true;
                        } else {
                            context.resultParams.files = null;
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
                stepLabel: "Параметры баз",
                nextButton: { needShow: true, isDisable: true },
                backButton: { needShow: true, isDisable: false },
                fields: [{
                    type: OptionType.input,
                    fieldLabel: "Шаблон наименования баз",
                    initValue: "новая база {Стартовый номер + шаг} / {Стартовый месяц или квартал}",
                    placeHolder: "",
                    onDataChange: (value: string, form: StepperDataStep) => {
                        context.resultParams.namePattern = value;
                        this.updateResultParams(context.resultParams);
                    }
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
                isCompleted: true,
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

    protected toFinalData(resultParams: MultipleUploadResultParams): StepperLabelField[] {
        const resultInfoFields: StepperLabelField[] = [{
            type: OptionType.label,
            fieldLabel: "Файл c техчастями:",
            text: "не выбран файл (необязательно)",
        },
        ];
        return resultInfoFields;
    }

    protected toSelectorBaseTypeOptions(baseData: AvailableNormativeBaseType[]): SelectorOption<AvailableNormativeBaseType>[] {
        console.log("!! | toSelectorBaseTypeOptions | baseData", baseData)
        const selectorOptions: SelectorOption<AvailableNormativeBaseType>[] = [];
        baseData.forEach(x => {
            selectorOptions.push({
                isAvailable: true,
                value: this.baseTypePipe.transform(x.type),
                data: x,
                action: () => {
                }
            });
        });
        return selectorOptions;
    }

    protected toSelectorBaseCategoryOptions(): SelectorOption<UploadBaseType>[] {
        const selectorOptions: SelectorOption<UploadBaseType>[] = [];
        selectorOptions.push({
            isAvailable: true,
            value: UploadBaseType.additions,
            data: UploadBaseType.additions,
            action: () => {
            }
        },{
            isAvailable: true,
            value: UploadBaseType.indecies,
            data: UploadBaseType.indecies,
            action: () => {
            }
        },{
            isAvailable: true,
            value: UploadBaseType.formuls,
            data: UploadBaseType.formuls,
            action: () => {
            }
        });
        return selectorOptions;
    }

    public updateResultParams(resultParams: MultipleUploadResultParams) {
        this.finalOptions.splice(0);
        this.finalOptions.push(...this.toFinalData(resultParams));
        this.updateParamsSub.next(resultParams);
    }
}