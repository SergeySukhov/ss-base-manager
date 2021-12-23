
export class StepperData {
    steps: StepperDataStep[] = [];
    isLinear: boolean = false;
}

export class StepperDataStep {
    stepLabel: string = "";
    isAwaiting?: boolean = false;
    needNextButton?: boolean;
    needBackButton?: boolean;
    needActionButton?: boolean;
    needResetButton?: boolean;
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
    onDataChange?: (value: any, form: StepperDataStep) => void = (value: any) => { return };
}

export class StepperLabelField extends StepperDataField<OptionType.label>  {
    text: string = "";
}

export class StepperInputField extends StepperDataField<OptionType.input>  {
    placeHolder?: string = "";
    onDataChange: (value: any, form: StepperDataStep) => void = (value: any) => { return };
}

export class StepperSelectorField extends StepperDataField<OptionType.selector>  {
    fieldOptions: SelectorOption[] | undefined;
    onDataChange: (value: any, form: StepperDataStep) => void = (value: any) => { return };
}

export class StepperDividerField extends StepperDataField<OptionType.divider>  {
}

export class StepperFileLoaderField extends StepperDataField<OptionType.fileLoader>  {
    onDataChange: (value: any, form: StepperDataStep) => void = (value: any) => { return };
}

export class SelectorOption {
    imgSrc?: string;
    value: string | undefined;
    isAvailable: boolean | undefined;
    data?: any;
    action: (value: any, form?: any) => void = (value: any) => { return };
}
