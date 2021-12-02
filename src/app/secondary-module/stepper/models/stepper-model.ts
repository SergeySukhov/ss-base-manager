
export interface StepperData {
    steps: StepperDataSteps[];
} 

export interface StepperDataSteps {
    stepLabel: string;

    needNextButton?: boolean;
    needPrevButton?: boolean;
    needResetButton?: boolean;

    fields: StepperDataField[];
} 

export enum OptionType {
    selector = "selector",
    input = "input",
    label = "label",
}

export abstract class StepperDataField {
    type: OptionType | undefined;
    fieldLabel?: string;
    onDataChange: ((value: any) => {}) | undefined;
}

export class StepperLabelField extends StepperDataField  {
}

export class StepperInputField extends StepperDataField  {
}

export class StepperSelectorField extends StepperDataField  {
    fieldOptions: SelectorOption[] | undefined;
}

export class SelectorOption {
    imgSrc?: string;
    value: string | undefined;
    isAvailable: boolean | undefined;

    action: ((value: any) => {}) | undefined;
}
