export const __esModule: boolean;
export class ConnectionManager {
    events: eventemitter3_1.EventEmitter<string | symbol, any>;
    connectStorage: storage_1.Storage;
    crypto: crypto_1.SessionCrypto;
    jwtKeyPair: any;
    connector: connect_1.OKXWalletConnector;
    packageId: number;
    connectedWalletPK: string;
    currentTopic: string;
    refreshPackageId(): void;
    saveCryptoKeyPair(keyPair: any): void;
    getCachedCryptoKeyPair(): any;
    saveJWTKeyPair(keyPair: any): void;
    getCachedJWTKeyPair(): any;
    isWalletPKReady(): boolean;
    makeJWT(topic: any): any;
    parsePackage(input_1: any, ...args: any[]): any;
    restoreConnect(topic: any): any;
    getConnectInfo(): {
        channelId: string;
        clientId: string;
    };
    connect(...args: any[]): any;
    disconnect(...args: any[]): any;
    addListener(event: any, success: any, fail: any): void;
    send(msg: any): any;
    sendACK(msgId_1: any, success_1: any, ...args: any[]): any;
    sendReceive(msgId: any, messageId: any, topic: any): any;
    sendFetchAndConsumeMessages(msgId: any, topic: any): any;
    cleanCache(): any;
    saveSessionContent(key: any, data: any): void;
    getSessionContent(key: any): any;
}
import eventemitter3_1 = require("eventemitter3");
import storage_1 = require("./storage");
import crypto_1 = require("../crypto/crypto");
import connect_1 = require("./connect");
