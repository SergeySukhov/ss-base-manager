
export class StepperData {
    steps: StepperDataStep[] = [];
    isLinear: boolean = false;
}

export class StepperDataStep {
    stepLabel: string = "";
    isAwaiting?: boolean = false;
    nextButton?: { needShow: boolean; isDisable: boolean };
    backButton?: { needShow: boolean; isDisable: boolean };
    actionButton?:  { needShow: boolean; isDisable: boolean };
    checkbox?:  { needShow: boolean; isDisable: boolean; value: boolean; text: string; checkboxAction: (value: boolean, form: StepperDataStep) => void | undefined; };
    resetButton?: { needShow: boolean; isDisable: boolean };
    isCompleted?: boolean;
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
    onDataChange: (value: any, form: StepperDataStep) => void = () => { return };
}

export class StepperSelectorField extends StepperDataField<OptionType.selector>  {
    fieldOptions: SelectorOption[] | undefined;
    onDataChange: (value: any, form: StepperDataStep) => void = () => { return };
}

export class StepperDividerField extends StepperDataField<OptionType.divider>  {
}

export class StepperFileLoaderField extends StepperDataField<OptionType.fileLoader>  {
    fileFormats?: string[];
    onDataChange: (value: any, form: StepperDataStep) => void = () => { return };
}

export class SelectorOption {
    imgSrc?: string;
    value: string | undefined;
    isAvailable: boolean | undefined;
    data?: any;
    action: (value: SelectorOption, form: StepperDataStep) => void = () => { return };
}
