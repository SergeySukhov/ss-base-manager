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
        return tokens[0] ?? undefined;
    }

    public async add(data: Token) {
        const tokens = await this.getAll();
        if (!tokens?.length) {
            await this.table.add(data);
        } else {
            await this.table.update(tokens[0].guid, data)
        }
    }

    public async remove() {
        const tokens = await this.getAll();
        if (tokens?.length) {
            await this.table.bulkDelete(tokens.map(x => x.guid));
        }
        return;
    }

    private async getAll(): Promise<Token[]> {
        return await this.table.toArray() ?? [];
    }
}
