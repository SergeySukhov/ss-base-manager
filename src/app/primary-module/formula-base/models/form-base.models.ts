
export class FormBaseResultParams {
    baseType: string = "";
    normBaseChoice: string | "addBase" = "";
    fileLocation: string = "";
    file: File | null = null;

    addBase?: {
        guid: string;
        name: string;
    }
}