
export class StepperData {
    steps: StepperDataStep[] = [];
}

export class StepperDataStep {
    stepLabel: string = "";
    isAwaiting?: boolean = false;
    needNextButton?: boolean;
    needBackButton?: boolean;
    needResetButton?: boolean;

    fields: StpFields[] = [];
}

export enum OptionType {
    selector = "selector",
    input = "input",
    label = "label",
}

export type StpFields = StepperLabelField | StepperInputField | StepperSelectorField;

export abstract class StepperDataField<T extends OptionType> {
    type: T | undefined;
    fieldLabel?: string;
    onDataChange: (value: any, form: StepperDataStep) => void = (value: any) => { return };
}

export class StepperLabelField extends StepperDataField<OptionType.label>  {
    text: string = "";
}

export class StepperInputField extends StepperDataField<OptionType.input>  {
}

export class StepperSelectorField extends StepperDataField<OptionType.selector>  {
    fieldOptions: SelectorOption[] | undefined;
}

export class SelectorOption {
    imgSrc?: string;
    value: string | undefined;
    isAvailable: boolean | undefined;

    action: (value: any, form?: any) => void = (value: any) => { return };
}
