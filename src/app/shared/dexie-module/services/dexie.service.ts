import Dexie from "dexie";

export const tokenDB = new Dexie("TokenStorage");
tokenDB.version(1).stores({
    tokens: "++guid",
});