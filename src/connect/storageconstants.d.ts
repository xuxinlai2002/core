export declare const OKXCONNECTOR_CACHE_KEY = "ck";
export declare const OKXCONNECTOR_CRYPTO_KEY = "cck_k";
export declare const OKXCONNECTOR_SESSION_PREFIX_KEY = "cspk_";
export declare const OKXCONNECTOR_JWT_KEY = "cjk_k";
export declare const OKXCONNECTOR_TOKEN_CACHE = "ct";
export declare const OKXCONNECTOR_CRYPTO_SENDER_PK_CACHE = "csp";
export declare const OKXCONNECTOR_TON_KEY = "OKXStorage_ctc";
export declare const OKXCONNECTOR_STORAGE_CRYPTO_PASSWORD = "scp";
export declare const OKXCONNECTOR_STORAGER_CRYPTO_SALT = "scs";
export declare const OKXCONNECTOR_STORAGE_CRYPTO_CIPHERIV = "scpc";
export declare const OKXCONNECTOR_STORAGE_CIPHER_METHOD = "aes-256-cbc";
export interface StorageItem {
    id: string;
    timestamp: string;
    content: string;
}
export interface PBKDF2AESInfo {
    pw: string;
    iv: string;
}
