import { BaseType } from "../AvailableNormativeBaseType";

export interface CommonRequest
{
    Guid: string;
    AdditionNumber: number;

    Deploy: boolean;
    IsNewDatabase: boolean;
    UserId: string;
    Type: BaseType;
}

export interface CommonRequestUploader extends CommonRequest
{
   SourceFile: File;
   DocumentZipFile: File | null;
}