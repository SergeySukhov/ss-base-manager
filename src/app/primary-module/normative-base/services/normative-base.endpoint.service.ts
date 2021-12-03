

export class NormativeBaseEndpointService { // implenets BaseEndpointService<>

    constructor() {

    }

    public async testGetData(): Promise<string[]> {
        const a = new Promise<string[]>((resolve, reject) => {
            setTimeout(() => {
                resolve(["1qwe", "2rty"]);
            }, 1000);
        });

        return a;
    }
}
