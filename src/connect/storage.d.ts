import { StorageItem } from "./storageconstants";
export declare class Storage {
    private static cacheKey;
    private cache;
    private subKey;
    private storeKey;
    private cipherIV;
    constructor(subKey: string);
    saveContent(content: string, key: string, id?: string): void;
    saveItem(item: StorageItem, key: string): void;
    getItem(key: string): StorageItem | null;
    private getCachedPBKDF2InfoKey;
    encryptStoreMsg(msg: string, key: string): void;
    getAndDecrypt(key: string): string | null;
    clearCache(key?: string | undefined): void;
}
