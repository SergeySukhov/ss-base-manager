import { BaseType } from "src/app/shared/models/server-models/AvailableNormativeBaseType";

export class ResultUploadParamsBase<TBase> {
    needDeploy = false;
    baseTypeName: string = "";
    baseType: BaseType | null = null;
    mainFile: File | null = null;
    baseChoice: TBase | null = null;

    addBase?: TBase;

    get isComplete(): boolean {
        return !!((!!this.baseType && !!this.baseChoice || !!this.addBase) && this.mainFile && this.additionalCompleteCondition())
    }

    additionalCompleteCondition = () => { return true };
}