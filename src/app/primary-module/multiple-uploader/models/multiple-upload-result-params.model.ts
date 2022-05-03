import { BaseType } from "src/app/shared/models/server-models/AvailableNormativeBaseType"

export enum UploadBaseType {
    indecies = "Индексы",
    additions = "Дополнения",
    formuls = "Формулы",
}

export class MultipleUploadResultParams {
    baseType: BaseType | null = null;
    uploadType: UploadBaseType | null = null;
    files: File[] | null = null;
    namePattern: string | null = null;

    needDeploy: boolean | null = null;

    
}