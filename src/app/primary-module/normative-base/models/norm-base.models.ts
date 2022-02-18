import { AvailableBaseAdditionInfo } from "src/app/shared/models/server-models/AvailableBaseAdditionInfo";
import { ResultUploadParamsBase } from "./base-result-params.model";

export class NormBaseResultParams extends ResultUploadParamsBase<AvailableBaseAdditionInfo> {

    fileFormuls: File | null = null;
    fileTechDocs: File | null = null;
    addBase?: AvailableBaseAdditionInfo;
}