import { BaseType, NormativeBaseInfo } from "src/app/shared/models/server-models/normative-base-info";

export class FormBaseResultParams {
    baseTypeName: string = "";
    normBaseChoice: NormativeBaseInfo | null = null;
    needDeploy = false;
    file: File | null = null;
    get isComplete(): boolean {
        return !!(this.baseTypeName && this.normBaseChoice && this.file)
    }
}

export interface BaseTypeInfo {
    type: BaseType,
    name: string,
}