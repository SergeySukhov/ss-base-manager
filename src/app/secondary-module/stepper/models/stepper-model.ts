
export class StepperData {
    steps: StepperDataStep[] = [];
    isLinear: boolean = false;
}

export class StepperDataStep {
    stepLabel: string = "";

    isAwaiting?: boolean;
    isOptional?: boolean;
    isCompleted?: boolean;

    nextButton?: StepCntrl;
    backButton?: StepCntrl;
    actionButton?: StepCntrl;
    resetButton?: StepCntrl;

    checkbox?: StepCheckboxCntrl;
    fields: StepFields[] = [];
    actionButtonAction?: (data?: any) => void | undefined;

}

export enum OptionType {
    selector = "selector",
    input = "input",
    label = "label",
    divider = "divider",
    fileLoader = "fileLoader",
}

export type StepFields = StepperLabelField | StepperInputField | StepperSelectorField | StepperDividerField | StepperFileLoaderField;

export abstract class StepperDataField<T extends OptionType> {
    type: T | undefined;
    fieldLabel?: string;
    onDataChange?: (value: any, form: StepperDataStep) => void = () => { return };
}

export class StepperLabelField extends StepperDataField<OptionType.label>  {
    text: string = "";
}

export class StepperInputField extends StepperDataField<OptionType.input>  {
    placeHolder?: string = "";
    inputType?: string = "";
    initValue?: any = "";
    onDataChange: (value: any, form: StepperDataStep) => void = () => { return };
}

export class StepperSelectorField extends StepperDataField<OptionType.selector>  {
    fieldOptions: SelectorOption<any>[] = [];
    startOption?: SelectorOption<any>;
    onDataChange: <T>(value: SelectorOption<T>, form: StepperDataStep) => void = () => { return };
}

export class StepperDividerField extends StepperDataField<OptionType.divider>  {
}

export class StepperFileLoaderField extends StepperDataField<OptionType.fileLoader>  {
    fileFormats?: string[];
    onDataChange: (value: File[], form: StepperDataStep) => void = () => { return };
}

export class SelectorOption<T> {
    imgSrc?: string;
    value: string | undefined;
    isAvailable: boolean | undefined;
    // TODO:
    data: any | T;
    action: (value: SelectorOption<T>, form: StepperDataStep) => void | Promise<void> = () => { return };
}

export interface StepCntrl { needShow: boolean; isDisable: boolean }
export interface StepActionCntrl extends StepCntrl {
    action: (value: any, form: StepperDataStep) => void | undefined;
}
export interface StepCheckboxCntrl extends StepActionCntrl {
    text: string;
    value: boolean;
    action: (value: boolean, form: StepperDataStep) => void | undefined;
}
