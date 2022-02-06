import { AvailableBaseAdditionInfo } from "src/app/shared/models/server-models/AvailableBaseAdditionInfo";
import { BaseTypeInfo } from "../../formula-base/models/form-base.models";
import { ResultUploadParamsBase } from "./base-result-params.model";

export class NormBaseResultParams extends ResultUploadParamsBase<AvailableBaseAdditionInfo> {

    fileFormuls: File | null = null;
    fileTechDocs: File | null = null;

    addBase?: {
        guid: string;
        name: string;
        additionNumber: number;
    }
}