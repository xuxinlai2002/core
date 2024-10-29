export const __esModule: boolean;
export class Storage {
    constructor(subKey: any);
    storeKey: string;
    cipherIV: string;
    subKey: any;
    cache: any;
    saveContent(content: any, key: any, id?: string): void;
    saveItem(item: any, key: any): void;
    getItem(key: any): any;
    getCachedPBKDF2InfoKey(): {
        pw: string;
        iv: string;
    };
    encryptStoreMsg(msg: any, key: any): void;
    getAndDecrypt(key: any): any;
    clearCache(key?: undefined): void;
}
export namespace Storage {
    let cacheKey: string;
}
