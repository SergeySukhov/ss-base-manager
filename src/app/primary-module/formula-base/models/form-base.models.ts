import { AvailableBaseAdditionInfo } from "src/app/shared/models/server-models/AvailableBaseAdditionInfo";
import { BaseType } from "src/app/shared/models/server-models/AvailableNormativeBaseType";

export class FormBaseResultParams {
    baseTypeName: string = "";
    normBaseChoice: AvailableBaseAdditionInfo | null = null;
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