"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Storage = void 0;
const storageconstants_1 = require("./storageconstants");
const tweetnacl_1 = __importDefault(require("tweetnacl"));
const utils_1 = require("../utils/utils");
const utils_2 = require("../utils");
const log = __importStar(require("../utils/log"));
const utils_3 = require("../utils");
const crypto_js_1 = require("crypto-js");
class Storage {
    constructor(subKey) {
        // 1. load data from local storage
        const localStorage = (0, utils_1.resolveLocalStorage)();
        this.storeKey = '';
        this.cipherIV = '';
        this.subKey = subKey;
        log.logDebug('--------get current local storage --------');
        log.logDebug(localStorage);
        const cacheStr = localStorage.getItem(Storage.cacheKey + subKey);
        if (typeof cacheStr === "undefined" || cacheStr === null) {
            log.logDebug("with no cache");
            this.cache = {};
            return;
        }
        log.logDebug(cacheStr);
        if ((cacheStr === null || cacheStr === void 0 ? void 0 : cacheStr.length) > 0) {
            var cacheObj = (0, utils_2.safeJsonParse)(cacheStr);
            this.cache = cacheObj;
        }
        log.logDebug(`get cache obj: ${this.cache}`);
        if (typeof this.cache === 'undefined' || this.cache == null) {
            this.cache = {};
        }
    }
    saveContent(content, key, id = '-') {
        let item = {
            id: id,
            timestamp: Date.now().toString(),
            content: content
        };
        this.saveItem(item, key);
    }
    saveItem(item, key) {
        let localKey = Storage.cacheKey + this.subKey;
        const localStorage = (0, utils_1.resolveLocalStorage)();
        log.logDebug(this.cache);
        log.logDebug(`get cache obj: ${this.cache}, ${key}, ${item}`);
        this.cache[key] = item;
        let totalCacheStr = (0, utils_2.safeJsonStringify)(this.cache);
        log.logDebug(`STORAGE: ${key} @ ${this.cache}`);
        localStorage.setItem(localKey, totalCacheStr);
    }
    getItem(key) {
        log.logDebug(`STORAGE >> getItem: ${key} @ ${this.cache}`);
        return this.cache[key];
    }
    getCachedPBKDF2InfoKey() {
        var _a, _b, _c, _d;
        const pwLen = 32;
        const saltLen = 24;
        if (this.storeKey.length > 0 && ((_a = this.cipherIV) === null || _a === void 0 ? void 0 : _a.length) > 0) {
            return {
                pw: this.storeKey,
                iv: this.cipherIV
            };
        }
        let salt = (_b = this.getItem(storageconstants_1.OKXCONNECTOR_STORAGER_CRYPTO_SALT)) === null || _b === void 0 ? void 0 : _b.content;
        if (!salt) {
            salt = (0, utils_1.toHexString)(tweetnacl_1.default.randomBytes(saltLen));
            this.saveContent(salt, storageconstants_1.OKXCONNECTOR_STORAGER_CRYPTO_SALT);
        }
        let pw = (_c = this.getItem(storageconstants_1.OKXCONNECTOR_STORAGE_CRYPTO_PASSWORD)) === null || _c === void 0 ? void 0 : _c.content;
        if (!pw) {
            pw = (0, utils_1.toHexString)(tweetnacl_1.default.randomBytes(pwLen));
            this.saveContent(pw, storageconstants_1.OKXCONNECTOR_STORAGE_CRYPTO_PASSWORD);
        }
        let cipherIV = (_d = this.getItem(storageconstants_1.OKXCONNECTOR_STORAGE_CRYPTO_CIPHERIV)) === null || _d === void 0 ? void 0 : _d.content;
        if (!cipherIV) {
            // let ivBuffer = Buffer.from(nacl.randomBytes(16))
            let ivBuffer = tweetnacl_1.default.randomBytes(16);
            cipherIV = (0, utils_1.toHexString)(ivBuffer);
            this.saveContent(cipherIV, storageconstants_1.OKXCONNECTOR_STORAGE_CRYPTO_CIPHERIV);
        }
        this.cipherIV = cipherIV;
        this.storeKey = (0, crypto_js_1.PBKDF2)(pw, salt, { iterations: 10 }).toString();
        return {
            pw: this.storeKey,
            iv: this.cipherIV
        };
    }
    encryptStoreMsg(msg, key) {
        (0, utils_3.logDebug)(`encryptStoreMsg  encryptStoreMsg start ${Date.now()}`);
        let storeInfo = this.getCachedPBKDF2InfoKey();
        (0, utils_3.logDebug)(`encryptStoreMsg  encryptStoreMsg mid ${Date.now()}`);
        var result = crypto_js_1.AES.encrypt(msg, storeInfo.pw).toString();
        this.saveContent(result, key);
        (0, utils_3.logDebug)(`encryptStoreMsg  encryptStoreMsg end ${Date.now()}`);
    }
    getAndDecrypt(key) {
        (0, utils_3.logDebug)(`encryptStoreMsg  getAndDecrypt start ${Date.now()}`);
        let item = this.getItem(key);
        if (item && item.content) {
            let storeInfo = this.getCachedPBKDF2InfoKey();
            (0, utils_3.logDebug)(`encryptStoreMsg  getAndDecrypt mid ${Date.now()}`);
            let result = crypto_js_1.AES.decrypt(item.content, storeInfo.pw).toString(crypto_js_1.enc.Utf8);
            (0, utils_3.logDebug)(`encryptStoreMsg  getAndDecrypt end ${Date.now()}`);
            return result;
        }
        return null;
    }
    clearCache(key = undefined) {
        if (key === undefined) {
            // clean all
            this.cache = {};
            let localKey = Storage.cacheKey + this.subKey;
            localStorage.setItem(localKey, '');
        }
        else {
            let localKey = Storage.cacheKey + this.subKey;
            const localStorage = (0, utils_1.resolveLocalStorage)();
            log.logDebug(this.cache);
            this.cache[key] = null;
            let totalCacheStr = (0, utils_2.safeJsonStringify)(this.cache);
            log.logDebug(`STORAGE: clean key ${key} @ ${this.cache}`);
            localStorage.setItem(localKey, totalCacheStr);
        }
    }
}
exports.Storage = Storage;
Storage.cacheKey = 'OKXStorageKey';
