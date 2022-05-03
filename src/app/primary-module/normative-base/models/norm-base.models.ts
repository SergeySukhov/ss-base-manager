import { AvailableBaseAdditionInfo } from "src/app/shared/models/server-models/AvailableBaseAdditionInfo";
import { ResultUploadParamsBase } from "../../../shared/common-components/uploader-base/models/base-result-params.model";

export class NormBaseResultParams extends ResultUploadParamsBase<AvailableBaseAdditionInfo> {
    fileFormuls: File | null = null;
    fileTechDocs: File | null = null;
}
