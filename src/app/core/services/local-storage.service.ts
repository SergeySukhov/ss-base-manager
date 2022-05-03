import { Injectable } from "@angular/core";


@Injectable()
export class LocalStorageService {

    constructor() {
    }

    setItem<T>(key: LocalStorageConst, value: T) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    getItem<T>(key: LocalStorageConst): T | null {
        const value = localStorage.getItem(key);
        if (value) {
            return JSON.parse(value);
        } else {
            return null;
        }
    }

    removeItem(key: LocalStorageConst) {
        localStorage.removeItem(key);
    }
    
    clear() {
        localStorage.clear();
    }

}

export enum LocalStorageConst {
    lastTokenTime = "lastTokenTime",
    username = "username",
    serverUrls = "serverUrls",
    lastContext = "lastContext",
    userId = "userId",
    lastControlTab = "lastControlTab",
    resultNormoParams = "resultNormoParams",
    resultFormulaParams = "resultFormulaParams",
    resultIndexParams = "resultIndexParams",
    resultMultipleUploadParams = "resultMultipleUploadParams",
    monitoringMainTabIndex = "monitoringMainTabIndex",
}