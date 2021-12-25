import { NormativeBaseInfo } from "src/app/shared/models/server-models/normative-base-info";
import { BaseTypeInfo } from "../../formula-base/models/form-base.models";

export class NormBaseResultParams {
    baseTypeName: string = "";
    normBaseChoice: NormativeBaseInfo | null = null;
    needDeploy = false;
    
    fileNormatives: File | null = null;
    fileFormuls: File | null = null;
    fileTechDocs: File | null = null;

    addBase?: {
        guid: string;
        name: string;
    }

    get isComplete(): boolean {
        return !!(this.baseTypeName && this.normBaseChoice && this.fileNormatives)
    }

    
}