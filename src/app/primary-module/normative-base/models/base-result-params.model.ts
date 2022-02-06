export class ResultUploadParamsBase<TBase> {
    baseTypeName: string = "";
    baseChoice: TBase | null = null;
    needDeploy = false;

    mainFile: File | null = null;

    additionalCompleteCondition?: boolean = true;

    get isComplete(): boolean {
        return !!(this.baseTypeName && this.baseChoice && this.mainFile && this.additionalCompleteCondition)
    }
}