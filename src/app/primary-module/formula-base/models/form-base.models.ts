
export class FormBaseResultParams {
    baseType: string = "";
    normBaseChoice: string | "addBase" = "";
    fileChoice: string = "";

    addBase?: {
        guid: string;
        name: string;
    }
}