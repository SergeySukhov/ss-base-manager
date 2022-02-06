import { AvailableBaseIndexInfo } from "src/app/shared/models/server-models/AvailableBaseIndexInfo";
import { ResultUploadParamsBase } from "../../normative-base/models/base-result-params.model";

export class IndexBaseResultParams extends ResultUploadParamsBase<AvailableBaseIndexInfo>  {
    addBase?: { base: AvailableBaseIndexInfo};
    nr: number = 0;
    sp: number = 0;
    fileTechDocs: File | null = null;
}

