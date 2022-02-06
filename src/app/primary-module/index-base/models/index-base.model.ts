import { AvailableBaseIndexInfo } from "src/app/shared/models/server-models/AvailableBaseIndexInfo";
import { ResultUploadParamsBase } from "../../normative-base/models/base-result-params.model";

export class IndexBaseResultParams extends ResultUploadParamsBase<AvailableBaseIndexInfo>  {
    addBase?: { nr: number; sp: number; base: AvailableBaseIndexInfo};
    fileTechDocs: File | null = null;
}

