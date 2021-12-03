import { OptionType, SelectorOption, StepperData, StepperSelectorField } from "src/app/secondary-module/stepper/models/stepper-model";


export class NormativeBaseDeclarationService {

    constructor() {

    }

    public async getStepperModel(): Promise<StepperData> {
        const stepperModel: StepperData = {
            steps: [{
                stepLabel: "Выбор вида НБ",
                fields: [{
                    type: OptionType.selector,
                    fieldLabel: "Доступные виды нормативных баз",
                    onDataChange: (value: string) => {},
                    fieldOptions: [{
                        isAvailable: true,
                        value: "ТСН МГЭ",
                        action: (value: string) => {}
                    }]
                } as StepperSelectorField]
            },],
        };
        return stepperModel;
    }
}