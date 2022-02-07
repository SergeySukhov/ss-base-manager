import { Injectable } from "@angular/core";
import { BaseTypePipe } from "src/app/core/pipes/base-type.pipe";
import { WorkCategoryPipe } from "src/app/core/pipes/work-type.pipe";
import { DeclarationBaseService } from "src/app/core/services/base-services/declaration-base.service";
import { SelectorOption, StepFields, StepperData, OptionType, StepperDataStep, StepperLabelField } from "src/app/secondary-module/stepper/models/stepper-model";
import { AvailableBaseAdditionInfo } from "src/app/shared/models/server-models/AvailableBaseAdditionInfo";
import { AvailableBaseIndexInfo, ReleasePeriodType } from "src/app/shared/models/server-models/AvailableBaseIndexInfo";
import { WorkCategory } from "src/app/shared/models/server-models/AvailableIndexWorkCategory";
import { AvailableNormativeBaseType, BaseType } from "src/app/shared/models/server-models/AvailableNormativeBaseType";
import { DateIndeciesHelper } from "src/app/shared/utils/date-indecies.helper.service";
import { v4 } from "uuid";
import { IndexBaseComponent } from "../index-base.component";
import { IndexBaseResultParams } from "../models/index-base.model";
import { IndexBaseEndpointService } from "./index-base.endpoint.service";

@Injectable()
export class IndexBaseDeclarationService extends DeclarationBaseService<AvailableBaseIndexInfo, IndexBaseResultParams> {

    finalOptions: StepFields[] = [];
    addIndexBase: AvailableBaseIndexInfo;

    constructor(private endpoint: IndexBaseEndpointService,
    ) {
        super();
        this.addIndexBase = this.initAddIndexBase();
    }

    public getStepperModel(context: IndexBaseComponent, avTypes: AvailableNormativeBaseType[]): StepperData {
        const stepperModel: StepperData = {
            isLinear: true,
            steps: [
                this.getBaseTypeStep(avTypes, context.resultParams, this.endpoint.getAvailableIndeciesBases.bind(this.endpoint)),
                ////////////////////////////////////////////////////////////////////
                {
                    stepLabel: "Выбор базы индексов",
                    nextButton: { needShow: true, isDisable: true },
                    backButton: { needShow: true, isDisable: false },
                    fields: [{
                        type: OptionType.selector,
                        fieldLabel: "Доступные базы индексов",
                        fieldOptions: this.baseFieldOptions,

                        onDataChange: (value: SelectorOption<AvailableBaseIndexInfo>, form: StepperDataStep) => {
                            context.resultParams.baseChoice = value.data as AvailableBaseIndexInfo;
                            this.addIndexBase.type = context.resultParams.baseType;

                            this.setAddBaseForm(!!value.imgSrc, context, form);

                            if (form.nextButton) {
                                form.nextButton.isDisable = !context.resultParams.baseChoice;;
                            }
                            form.isCompleted = !form.nextButton?.isDisable
                            this.updateResultParams(context.resultParams);
                        },
                    },
                    ],
                },
                ////////////////////////////////////////////////////////////////////
                {
                    stepLabel: "Параметры базы индексов",
                    nextButton: { needShow: true, isDisable: false },
                    backButton: { needShow: true, isDisable: false },
                    isCompleted: true,
                    fields: [
                        {
                            type: OptionType.input,
                            fieldLabel: "НР",
                            placeHolder: "",
                            inputType: "number",
                            initValue: context.resultParams.nr,
                            onDataChange: (value: string) => {
                                if (value) {
                                    context.resultParams.nr = Number.parseFloat(value);
                                }
                            }
                        }, {
                            type: OptionType.input,
                            fieldLabel: "СП",
                            inputType: "number",
                            initValue: context.resultParams.sp,
                            placeHolder: "",
                            onDataChange: (value: string) => {
                                if (value) {
                                    context.resultParams.sp = Number.parseFloat(value);
                                }
                            }
                        },
                    ],
                },
                ////////////////////////////////////////////////////////////////////
                {
                    stepLabel: "Добавление файла базы индексов (.xml)",
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
        }
        return stepperModel;
    }

    public update(resultParams: IndexBaseResultParams) {
        this.updateResultParams(resultParams);
    }

    protected toFinalData(resultParams: IndexBaseResultParams): StepFields[] {
        const resultInfoFields: StepperLabelField[] = [{
            type: OptionType.label,
            fieldLabel: "Вид базы:",
            text: this.baseTypePipe.transform(resultParams.baseType),
        }, {
            type: OptionType.label,
            fieldLabel: resultParams.addBase ? "Новая база индексов" : "База индексов:",
            text: resultParams.addBase ? this.getIndexName(resultParams.addBase.base) : this.getIndexName(resultParams.baseChoice),
        }, {
            type: OptionType.label,
            fieldLabel: "НР и СП:",
            text: "НР: " + resultParams.nr + " | СП: " + resultParams.sp ?? "не выбран файл (необязательно)",
        }, {
            type: OptionType.label,
            fieldLabel: "Файл c индексами:",
            text: resultParams.mainFile?.name ?? "не выбран файл",
        }, {
            type: OptionType.label,
            fieldLabel: "Файл c техчастями:",
            text: resultParams.fileTechDocs?.name ?? "не выбран файл (необязательно)",
        },
        ];
        // if (resultParams.addBase) {
        //     const nrspParams: StepperLabelField = {
        //         type: OptionType.label,
        //         fieldLabel: "НР и СП:",
        //         text: "НР: " + resultParams.nr + " | СП: " + resultParams.sp ?? "не выбран файл (необязательно)",
        //     };
        //     resultInfoFields.splice(2, 0, nrspParams);
        // }
        return resultInfoFields;
    }

    protected toSelectorBaseOptions(baseData: AvailableBaseIndexInfo[]): SelectorOption<AvailableBaseIndexInfo>[] {
        const selectorOptions: SelectorOption<AvailableBaseIndexInfo>[] = [];
        selectorOptions.push({
            isAvailable: true,
            imgSrc: "assets\\icons\\add.svg",
            value: "",
            data: {},
            action: () => { }
        });
        baseData.forEach(x => {
            selectorOptions.push({
                isAvailable: true,
                value: this.getIndexName(x),
                data: x,
                action: () => { }
            });
        });
        return selectorOptions;
    }

    private getIndexName(indexBase: AvailableBaseIndexInfo | null): string {
        return indexBase ? `Год: ${indexBase.year} | Период выпуска: ${DateIndeciesHelper.GetPeriod(indexBase)}` : "не выбраны параметры";
    }

    private initAddIndexBase(): AvailableBaseIndexInfo {
        const parentGuid = v4();
        return {
            guid: v4(),
            isAvailable: true,
            isCancelled: false,
            releasePeriodType: ReleasePeriodType.Month,
            releasePeriodValue: 0,
            techDocPath: "",
            type: BaseType.TSN_MGE,
            year: 2000,
            additionNumber: 1,
            availableIndexWorkCategoryGuid: parentGuid,
            parentIndex: {
                availableNormativeBaseTypeGuid: "",
                guid: parentGuid,
                parentIndexName: "",
                workCategory: WorkCategory.Build
            }
        }
    }

    private setAddBaseForm(needAddForm: boolean, context: IndexBaseComponent, form: StepperDataStep) {
        if (needAddForm) {
            this.addIndexBase.guid = v4();
            context.resultParams.addBase = { base: this.addIndexBase };
            form.stepLabel = "Добавление новой базы индексов"
            form.isCompleted = true;
            form.fields.push({
                type: OptionType.label,
                text: context.resultParams.addBase.base.guid,
                fieldLabel: "Идентификатор добаляемой базы индексов",
                onDataChange: () => { }
            }, {
                type: OptionType.selector,
                fieldLabel: "Год выпуска",
                startOptIdx: { value: this.getYearSelectorOptions().findIndex(x => x.value === "" + this.addIndexBase.year) } ?? undefined,
                fieldOptions: this.getYearSelectorOptions(),
                onDataChange: (value: SelectorOption<string>, form: StepperDataStep) => {
                    if (context.resultParams.addBase && value.value) {
                        this.addIndexBase.year = Number.parseInt(value.value)
                    }
                }
            }, {
                type: OptionType.selector,
                fieldLabel: "Период выпуска",
                startOptIdx: { value: this.getPeriodSelectorOptions().findIndex(x => x.value === DateIndeciesHelper.GetPeriod(this.addIndexBase)) } ?? undefined,
                fieldOptions: this.getPeriodSelectorOptions(),
                onDataChange: (value: SelectorOption<string>, form: StepperDataStep) => {
                    if (context.resultParams.addBase && value.value) {
                        const period = DateIndeciesHelper.toPeriodFromString(value.value);
                        this.addIndexBase.releasePeriodType = period?.periodType ?? ReleasePeriodType.Month;
                        this.addIndexBase.releasePeriodValue = period?.value ?? 0;
                    }
                }
            }, {
                type: OptionType.input,
                inputType: "number",
                fieldLabel: "Номер дополнения",
                placeHolder: "",
                initValue: this.addIndexBase.additionNumber,
                onDataChange: (value: string) => {
                    if (context.resultParams.addBase && value) {
                        this.addIndexBase.additionNumber = Number.parseInt(value);
                    }
                }
            },
            )
        } else {
            form.stepLabel = "Выбор базы индексов"
            context.resultParams.addBase = undefined;
            form.fields.splice(1);
        }
        return;
    }

    private getYearSelectorOptions(): SelectorOption<string>[] {
        return DateIndeciesHelper.GetAllIndeciesYears().map(year => {
            return {
                value: year,
                action: () => { },
                isAvailable: true,
                data: {},
            }
        });
    }

    private getPeriodSelectorOptions(): SelectorOption<string>[] {
        return DateIndeciesHelper.GetAllMonths().concat(...DateIndeciesHelper.GetAllQuarters()).map(x => {
            return {
                value: x,
                action: () => { },
                isAvailable: true,
                data: {},
            }
        });
    }
}
