import { NormativeBaseInfo } from "src/app/shared/models/server-models/normative-base-info";

export class FormBaseResultParams {
    baseType: string = "";
    normBaseChoice: NormativeBaseInfo | null = null;
    needDeploy = false;
    file: File | null = null;
}