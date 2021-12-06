
export class StepperData {
    steps: StepperDataStep[] = [];
}

export class StepperDataStep {
    stepLabel: string = "";
    isAwaiting?: boolean = false;
    needNextButton?: boolean;
    needBackButton?: boolean;
    needResetButton?: boolean;

    fields: StepFields[] = [];
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
    onDataChange: (value: any, form: StepperDataStep) => void = (value: any) => { return };
}

export class StepperLabelField extends StepperDataField<OptionType.label>  {
    text: string = "";
}

export class StepperInputField extends StepperDataField<OptionType.input>  {
    placeHolder?: string = "";
}

export class StepperSelectorField extends StepperDataField<OptionType.selector>  {
    fieldOptions: SelectorOption[] | undefined;
}

export class StepperDividerField extends StepperDataField<OptionType.divider>  {
}

export class StepperFileLoaderField extends StepperDataField<OptionType.fileLoader>  {
}

export class SelectorOption {
    imgSrc?: string;
    value: string | undefined;
    isAvailable: boolean | undefined;

    action: (value: any, form?: any) => void = (value: any) => { return };
}
