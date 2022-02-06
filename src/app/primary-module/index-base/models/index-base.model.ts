import { AvailableBaseIndexInfo } from "src/app/shared/models/server-models/AvailableBaseIndexInfo";
import { ResultUploadParamsBase } from "../../normative-base/models/base-result-params.model";

export class IndexBaseResultParams extends ResultUploadParamsBase<AvailableBaseIndexInfo>  {
    additionNumber: number = 0;

    addBase?: {
        guid: string;
        name: string;
        additionNumber: number;
    }
}

