import { Injectable } from "@angular/core";
import { observable } from "mobx";
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
import { BaseTypeInfo } from "../../formula-base/models/form-base.models";
import { IndexBaseComponent } from "../index-base.component";
import { IndexBaseResultParams } from "../models/index-base.model";
import { IndexBaseEndpointService } from "./index-base.endpoint.service";

@Injectable()
export class IndexBaseDeclarationService extends DeclarationBaseService<AvailableBaseIndexInfo, IndexBaseResultParams> {

    @observable normativeBaseOpions: SelectorOption<AvailableBaseAdditionInfo>[] = [];
    finalOptions: StepFields[] = [];
    indexYearOptions: SelectorOption<string>[];
    indexPeriodOptions: SelectorOption<string>[];

    constructor(private endpoint: IndexBaseEndpointService,
    ) {
        super();
        this.indexYearOptions = this.getYearSelectorOptions()
        this.indexPeriodOptions = this.getPeriodSelectorOptions()
    }

    public getStepperModel(context: IndexBaseComponent, avTypes: AvailableNormativeBaseType[]): StepperData {
        context.resultParams.addBase = context.resultParams.addBase ?? this.initAddIndexBase();;
        context.resultParams.addBase.guid = v4();
        if (context.resultParams.baseType) {
            this.endpoint.getAvailableNormativeBases(context.resultParams.baseType).then(availableNB => {
                this.normativeBaseOpions.splice(0);
                this.normativeBaseOpions.push(...this.toSelectorNormativeBaseOptions(availableNB ?? []));
            });
        }
        const baseTypeOptions = this.toSelectorBaseTypeOptions(avTypes);
        const stepperModel: StepperData = {
            isLinear: true,
            steps: [{
                stepLabel: "?????????? ???????? ????",
                nextButton: { needShow: true, isDisable: !context.resultParams.baseType },
                isCompleted: !!context.resultParams.baseType,
                isAwaiting: false,
                fields: [{
                    fieldOptions: baseTypeOptions,
                    type: OptionType.selector,
                    startOption: baseTypeOptions.find(x => x.value === this.baseTypePipe.transform(context.resultParams.baseType)),
                    fieldLabel: "?????????????????? ???????? ?????????????????????? ??????",
                    onDataChange: async (value: SelectorOption<BaseTypeInfo>, form: StepperDataStep) => {
                        const data = value.data as BaseTypeInfo;
                        context.resultParams.baseType = data.type;
                        
                        form.isAwaiting = true;
                        const availableNB = await this.endpoint.getAvailableNormativeBases(data.type);
                        form.isAwaiting = false;
                        if (!availableNB) {
                            console.error("!! ?????? ?????????????????? ?????????????????????? ??????", availableNB)
                            return;
                        }
                        this.normativeBaseOpions.splice(0);
                        this.normativeBaseOpions.push(...this.toSelectorNormativeBaseOptions(availableNB));

                        form.isCompleted = true;
                        context.resultParams.baseTypeName = data.name;

                        if (form.nextButton) {
                            form.nextButton.isDisable = false;
                        }

                        this.updateResultParams(context.resultParams);
                    },
                }],
            },
            // this.getBaseTypeStep(avTypes, context.resultParams, this.endpoint.getAvailableIndeciesBases.bind(this.endpoint)),
            ////////////////////////////////////////////////////////////////////
            {
                stepLabel: "?????????? ????",
                nextButton: { needShow: true, isDisable: !context.resultParams.additionNormativBase },
                backButton: { needShow: true, isDisable: false },
                isCompleted: !!context.resultParams.additionNormativBase,
                fields: [{
                    type: OptionType.selector,
                    fieldLabel: "?????????????????? ????",
                    fieldOptions: this.normativeBaseOpions,
                    startOptionGet: (form: StepperDataStep) => {
                        return this.normativeBaseOpions.find(x => x.data.guid === context.resultParams.additionNormativBase?.guid)
                    },
                    onDataChange: (value: SelectorOption<AvailableBaseAdditionInfo>, form: StepperDataStep) => {
                        const base = value.data as AvailableBaseAdditionInfo;
                        context.resultParams.additionNormativBase = base;
                        form.isCompleted = !!context.resultParams.additionNormativBase;
                        form.nextButton ? form.nextButton.isDisable = !form.isCompleted : console.error("!!");

                        this.updateResultParams(context.resultParams);
                    },
                },
                ],
            },
            ////////////////////////////////////////////////////////////////////
            {
                stepLabel: "?????????????????? ???????? ????????????????",
                nextButton: { needShow: true, isDisable: false },
                backButton: { needShow: true, isDisable: false },
                isCompleted: true,
                fields: [{
                    type: OptionType.label,
                    text: context.resultParams.addBase.guid,
                    fieldLabel: "?????????????????????????? ?????????????????????? ???????? ????????????????",
                    onDataChange: () => { }
                },
                {
                    type: OptionType.selector,
                    fieldLabel: "?????? ??????????????",
                    startOption: this.indexYearOptions.find(x => x.value === "" + context.resultParams.addBase?.year),
                    fieldOptions: this.indexYearOptions,
                    onDataChange: (value: SelectorOption<string>, form: StepperDataStep) => {
                        if (context.resultParams.addBase && value.value) {
                            context.resultParams.addBase.year = Number.parseInt(value.value)
                            this.updateResultParams(context.resultParams);
                        }
                    }
                }, {
                    type: OptionType.selector,
                    fieldLabel: "???????????? ??????????????",
                    startOption: this.indexPeriodOptions.find(x => x.value === DateIndeciesHelper.GetPeriod(context.resultParams.addBase)),
                    fieldOptions: this.indexPeriodOptions,
                    onDataChange: (value: SelectorOption<string>, form: StepperDataStep) => {
                        if (context.resultParams.addBase && value.value) {
                            const period = DateIndeciesHelper.toPeriodFromString(value.value);
                            context.resultParams.addBase.releasePeriodType = period?.periodType ?? ReleasePeriodType.Month;
                            context.resultParams.addBase.releasePeriodValue = period?.value ?? 0;
                            this.updateResultParams(context.resultParams);
                        }
                    }
                }, {
                    type: OptionType.input,
                    fieldLabel: "????",
                    placeHolder: "",
                    inputType: "number",
                    initValue: context.resultParams.nr,
                    onDataChange: (value: string) => {
                        if (value) {
                            context.resultParams.nr = Number.parseFloat(value);
                            this.updateResultParams(context.resultParams);
                        }
                    }
                }, {
                    type: OptionType.input,
                    fieldLabel: "????",
                    inputType: "number",
                    initValue: context.resultParams.sp,
                    placeHolder: "",
                    onDataChange: (value: string) => {
                        if (value) {
                            context.resultParams.sp = Number.parseFloat(value);
                            this.updateResultParams(context.resultParams);
                        }
                    }
                },
                ],
            },
            ////////////////////////////////////////////////////////////////////
            {
                stepLabel: "???????????????????? ?????????? ???????? ???????????????? (.xml)",
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
                stepLabel: "???????????????????? ???????????? ??????. ???????????? (.pdf)",
                nextButton: { needShow: true, isDisable: false },
                backButton: { needShow: true, isDisable: false },
                isOptional: true,
                fields: [{
                    type: OptionType.fileLoader,
                    fieldLabel: "",
                    fileFormats: [".pdf"],
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
                stepLabel: "????????",
                nextButton: { needShow: false, isDisable: false },
                resetButton: { needShow: true, isDisable: false },
                backButton: { needShow: true, isDisable: false },
                actionButton: { needShow: true, isDisable: false },
                checkbox: {
                    needShow: true,
                    isDisable: false,
                    text: "???????????????????? ?????????????????????? ?????????? ???????????????????? ????????",
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
        }
        return stepperModel;
    }

    public update(resultParams: IndexBaseResultParams) {
        this.updateResultParams(resultParams);
    }

    protected toFinalData(resultParams: IndexBaseResultParams): StepFields[] {
        const resultInfoFields: StepperLabelField[] = [{
            type: OptionType.label,
            fieldLabel: "?????? ????????:",
            text: this.baseTypePipe.transform(resultParams.baseType),
        },  {
            type: OptionType.label,
            text: resultParams.additionNormativBase?.additionNumber.toString() ?? "?????? ???????????? ????????????????????",
            fieldLabel: "?????????? ????????????????????",
            onDataChange: () => { }
        }, {
            type: OptionType.label,
            fieldLabel: resultParams.addBase ? "?????????? ???????? ????????????????" : "???????? ????????????????:",
            text: resultParams.addBase ? this.getIndexName(resultParams.addBase) : this.getIndexName(resultParams.baseChoice),
        }, {
            type: OptionType.label,
            fieldLabel: "???? ?? ????:",
            text: "????: " + resultParams.nr + " | ????: " + resultParams.sp ?? "???? ???????????? ???????? (??????????????????????????)",
        }, {
            type: OptionType.label,
            fieldLabel: "???????? c ??????????????????:",
            text: resultParams.mainFile?.name ?? "???? ???????????? ????????",
        }, {
            type: OptionType.label,
            fieldLabel: "???????? c ????????????????????:",
            text: resultParams.fileTechDocs?.name ?? "???? ???????????? ???????? (??????????????????????????)",
        },
        ];
        return resultInfoFields;
    }

    protected toSelectorBaseOptions(baseData: AvailableBaseIndexInfo[]): SelectorOption<string>[] {
        const uniqYearsSet = new Set(baseData.map(x => x.year));
        const uniqYear = Array.from(uniqYearsSet);
        const selectorOptions: SelectorOption<string>[] = [];

        selectorOptions.push({
            isAvailable: true,
            imgSrc: "assets\\icons\\add.svg",
            value: "",
            data: {},
            action: () => { }
        });
        uniqYear.forEach(x => {
            selectorOptions.push({
                isAvailable: true,
                value: "" + x,
                data: x,
                action: () => { }
            });
        });
        return selectorOptions;
    }

    protected toSelectorNormativeBaseOptions(baseData: AvailableBaseAdditionInfo[]): SelectorOption<AvailableBaseAdditionInfo>[] {
        const selectorOptions: SelectorOption<AvailableBaseAdditionInfo>[] = [];
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

    private getIndexName(indexBase: AvailableBaseIndexInfo | null): string {
        return indexBase ? `??????: ${indexBase.year} | ???????????? ??????????????: ${DateIndeciesHelper.GetPeriod(indexBase)}` : "???? ?????????????? ??????????????????";
    }

    private initAddIndexBase(): AvailableBaseIndexInfo {
        const parentGuid = v4();
        return {
            guid: v4(),
            isAvailable: true,
            isCancelled: false,
            releasePeriodType: ReleasePeriodType.Month,
            releasePeriodValue: 1,
            techDocPath: "",
            type: BaseType.TSN_MGE,
            year: 2000,
            additionNumber: 0,
            availableIndexWorkCategoryGuid: parentGuid,
            parentIndex: {
                availableNormativeBaseTypeGuid: "",
                guid: parentGuid,
                parentIndexName: "",
                workCategory: WorkCategory.Build
            }
        }
    }

    private getYearSelectorOptions(years?: number[]): SelectorOption<string>[] {
        if (years) {
            return years.map(year => {
                return {
                    value: "" + year,
                    action: () => { },
                    isAvailable: true,
                    data: year,
                }
            });
        } else {
            return DateIndeciesHelper.GetAllIndeciesYears().map(year => {
                return {
                    value: year,
                    action: () => { },
                    isAvailable: true,
                    data: {},
                }
            });
        }

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
