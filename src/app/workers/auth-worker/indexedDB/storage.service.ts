import Dexie from "dexie";
import { tokenDB } from "src/app/shared/dexie-module/services/dexie.service";
import { Token } from "../models/token.model";

export class StorageService {

    private table: Dexie.Table<Token, string>;

    constructor() {
       this.table = tokenDB.table('tokens');
    }

    public async getLastToken(): Promise<Token | undefined> {
        const tokens = await this.getAll();
        let token: Token | undefined = undefined;
        if (tokens.length) {
            token = tokens[0];
            tokens.forEach(x => {
                this.remove(x.guid);
            });
        }
        console.log("!! | getLastToken | tokens", tokens)
        return token;
    }
   
    public async add(data: Token) {
        return this.table.add(data);
    }

    public async update(id: string, data: Token) {
        return await this.table.update(id, data);
    }

    async remove(id: string) {
        return await this.table.bulkDelete([id]);
    }

    private async getAll(): Promise<Token[]> {
        return await this.table.toArray() ?? [];
    }
}
