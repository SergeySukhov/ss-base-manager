import { AvailableBaseIndexInfo } from "src/app/shared/models/server-models/AvailableBaseIndexInfo";

export class IndexBaseResultParams {
    baseTypeName: string = "";
    additionNumber: number = 0;

    indexBaseChoice: AvailableBaseIndexInfo | null = null;
    needDeploy = false;
    file: File | null = null;
    get isComplete(): boolean {
        return !!(this.baseTypeName && this.indexBaseChoice && this.file)
    }
}

