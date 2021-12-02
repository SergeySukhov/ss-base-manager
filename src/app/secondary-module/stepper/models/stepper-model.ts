
export interface StepperData {
    steps: StepperDataSteps[];
} 

export interface StepperDataSteps {
    stepLabel: string;

    needNext?: boolean;
    needPrev?: boolean;
    needReset?: boolean;

    fields: StepperDataField[];
} 

export enum OptionType {
    select = "select",
    input = "input",
    label = "label",
}

export abstract class StepperOption {
    type: OptionType | undefined;
    imgSrc?: string;
    value: string | undefined;
    onClickAction: ((value: StepperSelectOption) => {}) | undefined;
}

export interface StepperDataField {
    fieldLabel: string;
    fieldSelectOptions?: StepperOption[]; 
    fieldInputOptions?: StepperInputOption[]; 
    fieldLabelOptions?: StepperLabelOption[]; 
    onDataChange: (value: StepperOption) => { };
}

export class StepperSelectOption extends StepperOption {
    constructor() {
        super();
        this.type = OptionType.select;
    }
}

export class StepperInputOption extends StepperOption {
    constructor() {
        super();
        this.type = OptionType.input;
    }
}

export class StepperLabelOption extends StepperOption {
    constructor() {
        super();
        this.type = OptionType.label;
    }
}