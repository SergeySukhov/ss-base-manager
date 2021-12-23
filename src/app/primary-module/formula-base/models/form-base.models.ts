import { NormativeBaseInfo } from "src/app/shared/models/server-models/normative-base-info";

export class FormBaseResultParams {
    baseType: string = "";
    normBaseChoice: NormativeBaseInfo | null = null;
    file: File | null = null;
}