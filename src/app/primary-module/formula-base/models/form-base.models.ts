import { AvailableBaseAdditionInfo } from "src/app/shared/models/server-models/AvailableBaseAdditionInfo";
import { BaseType } from "src/app/shared/models/server-models/AvailableNormativeBaseType";
import { ResultUploadParamsBase } from "../../../shared/common-components/uploader-base/models/base-result-params.model";

export class FormBaseResultParams extends ResultUploadParamsBase<AvailableBaseAdditionInfo>  {
    baseTypeName: string = "";
}

export interface BaseTypeInfo {
    type: BaseType,
    name: string,
}