import { BaseType } from "src/app/shared/models/server-models/AvailableNormativeBaseType";

export class ResultUploadParamsBase<TBase> {
    baseTypeName: string = "";
    baseType: BaseType | null = null;
    baseChoice: TBase | null = null;
    needDeploy = false;

    mainFile: File | null = null;

    additionalCompleteCondition?: boolean = true;

    get isComplete(): boolean {
        return !!(this.baseTypeName && this.baseChoice && this.mainFile && this.additionalCompleteCondition)
    }
}