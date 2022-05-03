import { AvailableBaseAdditionInfo } from "src/app/shared/models/server-models/AvailableBaseAdditionInfo";
import { AvailableBaseIndexInfo } from "src/app/shared/models/server-models/AvailableBaseIndexInfo";
import { ResultUploadParamsBase } from "../../../shared/common-components/uploader-base/models/base-result-params.model";

export class IndexBaseResultParams extends ResultUploadParamsBase<AvailableBaseIndexInfo>  {
    nr: number = 0;
    sp: number = 0;
    additionNormativBase: AvailableBaseAdditionInfo | null = null;
    fileTechDocs: File | null = null;
}

