
export class StepperData {
    steps: StepperDataSteps[] = [];
} 

export class StepperDataSteps {
    stepLabel: string = "";

    needNextButton?: boolean;
    needPrevButton?: boolean;
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
    onDataChange: ((value: any) => {}) | undefined;
}

export class StepperLabelField extends StepperDataField<OptionType.label>  {
    kjmijmk: string="";
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

    action: ((value: any) => {}) | undefined;
}
