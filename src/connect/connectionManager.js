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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionManager = void 0;
const connect_1 = require("./connect");
const commands_1 = require("./commands");
const storageconstants_1 = require("./storageconstants");
const jwtconstants_1 = require("./jwtconstants");
const constants_1 = require("./constants");
const eventemitter3_1 = require("eventemitter3");
const storage_1 = require("./storage");
const utils_1 = require("../utils/utils");
const crypto_1 = require("../crypto/crypto");
const jwt_1 = require("./jwt");
const safejson_1 = require("../utils/safejson");
const log = __importStar(require("../utils/log"));
const log_1 = require("../utils/log");
class ConnectionManager {
    constructor() {
        this.events = new eventemitter3_1.EventEmitter();
        // local storage
        this.connectStorage = new storage_1.Storage(storageconstants_1.OKXCONNECTOR_CACHE_KEY);
        this.crypto = new crypto_1.SessionCrypto();
        this.jwtKeyPair = this.getCachedJWTKeyPair();
        this.saveJWTKeyPair(this.jwtKeyPair);
        // wss connection
        this.connector = new connect_1.OKXWalletConnector(constants_1.OKXCONNECTOR_WS_URL);
        this.packageId = Date.now();
        // connection state
        this.connectedWalletPK = '';
        this.currentTopic = '';
        log.logDebug(`this.connectedWalletPK  constructor   ${this.connectedWalletPK}`);
    }
    refreshPackageId() {
        this.packageId = Date.now();
    }
    saveCryptoKeyPair(keyPair) {
        let cacheInfo = (0, safejson_1.safeJsonStringify)(keyPair);
        // encrypt kp
        this.connectStorage.encryptStoreMsg(cacheInfo, storageconstants_1.OKXCONNECTOR_CRYPTO_KEY);
    }
    getCachedCryptoKeyPair() {
        // decrypt kp
        const kp = this.connectStorage.getAndDecrypt(storageconstants_1.OKXCONNECTOR_CRYPTO_KEY);
        const content = kp;
        if (typeof content == 'string') {
            log.logDebug('get cached crypto key:');
            log.logDebug(content);
            let keyPairInfo = (0, safejson_1.safeJsonParse)(content);
            return keyPairInfo;
        }
        else {
            this.connectStorage.clearCache();
        }
        return null;
    }
    saveJWTKeyPair(keyPair) {
        var strkeyPair = {
            publicKey: (0, utils_1.toHexString)(keyPair.publicKey),
            secretKey: (0, utils_1.toHexString)(keyPair.secretKey)
        };
        log.logDebug('save jwt kp');
        let cacheInfo = (0, safejson_1.safeJsonStringify)(strkeyPair);
        log.logDebug(cacheInfo);
        // encrypt jwt kp
        this.connectStorage.encryptStoreMsg(cacheInfo, storageconstants_1.OKXCONNECTOR_JWT_KEY);
    }
    getCachedJWTKeyPair() {
        const kp = this.connectStorage.getAndDecrypt(storageconstants_1.OKXCONNECTOR_JWT_KEY);
        const content = kp;
        if (typeof content == 'string') {
            // TODO: decrypt jwt kp
            log.logDebug('get cached jwt kp:');
            log.logDebug(content);
            let strKeyPairInfo = (0, safejson_1.safeJsonParse)(content);
            log.logDebug('save jwt kp');
            log.logDebug(strKeyPairInfo);
            var keyPair = {
                publicKey: (0, utils_1.hexToByteArray)(strKeyPairInfo.publicKey),
                secretKey: (0, utils_1.hexToByteArray)(strKeyPairInfo.secretKey)
            };
            return keyPair;
        }
        else {
            return (0, jwt_1.generateKeyPair)();
        }
    }
    isWalletPKReady() {
        log.logDebug(`isWalletPKReady  ===> ${this.connectedWalletPK}`);
        return this.connectedWalletPK.length > 0;
    }
    makeJWT(topic) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, jwt_1.signJWT)(topic, jwtconstants_1.OKXCONNECTOR_JWT_SIDE, jwtconstants_1.OKXCONNECTOR_JWT_TTL, // 24h
            this.jwtKeyPair);
        });
    }
    parsePackage(input_1) {
        return __awaiter(this, arguments, void 0, function* (input, ignoreACK = false) {
            var _a, _b, _c;
            this.events.emit(input.id, input);
            // send back ACK
            if (!ignoreACK) {
                yield this.sendACK(input.id, true);
                let topic = (_a = this.connectStorage.getItem(storageconstants_1.OKXCONNECTOR_TOKEN_CACHE)) === null || _a === void 0 ? void 0 : _a.content;
                if (topic) {
                    let inputObj = input;
                    if ((_c = (_b = inputObj.params) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.messageId) {
                        this.refreshPackageId();
                        yield this.sendReceive(this.packageId.toString(), input.id, topic);
                    }
                }
            }
        });
    }
    restoreConnect(topic) {
        return __awaiter(this, void 0, void 0, function* () {
            log.logDebug(`connectionManager  restoreConenct   ${topic}`);
            if ((typeof topic !== 'string') || topic.length === 0) {
                throw new Error('CONNECTION: invalid topic');
            }
            log.logDebug(`connectionManager  restoreConenct   disconnect`);
            yield this.disconnect(true);
            this.connectStorage.saveContent(topic, storageconstants_1.OKXCONNECTOR_TOKEN_CACHE);
            log.logDebug(`connectionManager  restoreConenct   conect`);
            yield this.connect(true);
        });
    }
    getConnectInfo() {
        var topic = (0, utils_1.generateTopic)();
        log.logDebug(`generate topic token: ${topic}`);
        this.currentTopic = topic;
        const info = {
            channelId: topic,
            clientId: this.crypto.stringifyKeypair().publicKey,
        };
        return info;
    }
    connect() {
        return __awaiter(this, arguments, void 0, function* (fromRestore = false) {
            this.timeLog = new Date().getTime();
            (0, log_1.logDebug)("ConnectTime---enter->", this.timeLog);
            let lastConnectId = this.connectStorage.getItem(storageconstants_1.OKXCONNECTOR_TOKEN_CACHE);
            //1. generate topic & jwt
            var topic = this.currentTopic;
            log.logDebug(`generate topic token: ${topic}`);
            // crypto keypair
            if (fromRestore) {
                if (typeof lastConnectId !== 'undefined' && lastConnectId !== null) {
                    log.logDebug(`read last connect id: ${lastConnectId}`);
                    topic = lastConnectId.content;
                }
                var cachedSenderPublicKey = this.connectStorage.getItem(storageconstants_1.OKXCONNECTOR_CRYPTO_SENDER_PK_CACHE);
                if (cachedSenderPublicKey) {
                    this.connectedWalletPK = cachedSenderPublicKey.content;
                }
                // recovery from cache
                const keyPairInfo = this.getCachedCryptoKeyPair();
                this.crypto = new crypto_1.SessionCrypto(keyPairInfo);
            }
            log.logDebug(`use crypto client id: ${this.crypto.stringifyKeypair().publicKey}`);
            // cache topic
            this.connectStorage.saveContent(topic, storageconstants_1.OKXCONNECTOR_TOKEN_CACHE);
            var jwtToken = yield this.makeJWT(topic);
            log.logDebug(`generate jwt token: ${jwtToken}`);
            this.connectStorage.saveContent(jwtToken, 'jwt');
            return new Promise((resolve, reject) => {
                // 1. when websocket opened
                this.connector.onOpen(() => __awaiter(this, void 0, void 0, function* () {
                    log.logDebug(`1. connector on open`);
                    const timeOne = new Date().getTime();
                    (0, log_1.logDebug)("ConnectTime---open->", timeOne - this.timeLog);
                    //2. send jwt to login
                    this.events.once(this.packageId.toString(), (rsp) => __awaiter(this, void 0, void 0, function* () {
                        // ack
                        if (rsp && rsp.error) {
                            log.logError('failed when login');
                            yield this.connector.disconnect();
                            var error = new Error();
                            error.message = rsp.error.message;
                            error.name = rsp.error.code.toString();
                            // throw error
                            reject(error);
                        }
                        //3. send subscribe
                        this.refreshPackageId();
                        this.events.once(this.packageId.toString(), (rsp) => __awaiter(this, void 0, void 0, function* () {
                            // ack
                            if (rsp && rsp.error) {
                                log.logError('failed when subscribe');
                                yield this.connector.disconnect();
                                var error = new Error();
                                error.message = rsp.error.message;
                                error.name = rsp.error.code.toString();
                                // throw error
                                reject(error);
                            }
                            this.refreshPackageId();
                            log.logDebug(`4. subscribe callback then send fetch: ${this.packageId}`);
                            const timeF = new Date().getTime();
                            (0, log_1.logDebug)("ConnectTime--subscribe callback->", timeF - this.timeLog);
                            // 4. fetch messages
                            yield this.sendFetchAndConsumeMessages(this.packageId.toString(), topic);
                            resolve();
                        }));
                        log.logDebug(`3. login callback then send subscribe: ${this.packageId}`);
                        const timeTh = new Date().getTime();
                        (0, log_1.logDebug)("ConnectTime---login callback->", timeTh - this.timeLog);
                        yield this.connector.send(() => __awaiter(this, void 0, void 0, function* () {
                            log.logDebug('CONNECT: reconnect before send');
                            yield this.connector.connect();
                        }), {
                            id: this.packageId.toString(),
                            jsonrpc: constants_1.CONNECT_JSONRPC_VER,
                            method: commands_1.CONNECT_METHOD_SUB,
                            params: {
                                topic: topic
                            }
                        });
                    }));
                    log.logDebug(`2. login called`);
                    yield this.connector.send(() => __awaiter(this, void 0, void 0, function* () {
                        log.logDebug('CONNECT: reconnect before send');
                        yield this.connector.connect();
                    }), {
                        id: this.packageId.toString(),
                        jsonrpc: constants_1.CONNECT_JSONRPC_VER,
                        method: commands_1.CONNECT_METHOD_LOGIN,
                        params: {
                            token: jwtToken
                        }
                    });
                    // 4. listen when dapp back to front, receive wallet public key
                    this.connector.addPackageParse((event) => {
                        var _a;
                        log.logDebug(`connect: parse package`);
                        log.logDebug(event);
                        if (!("params" in event) || !("data" in event["params"])) {
                            this.parsePackage(event, true);
                            return;
                        }
                        let rawMsg = (_a = event.params.data) === null || _a === void 0 ? void 0 : _a.message;
                        if (typeof rawMsg !== 'undefined') {
                            rawMsg = rawMsg.replace(/'/g, '"');
                            let parsedMessage = (0, safejson_1.safeJsonParse)(rawMsg);
                            if (typeof parsedMessage !== 'string' && "clientId" in parsedMessage && parsedMessage.clientId && parsedMessage.clientId.length > 0) {
                                this.connectedWalletPK = parsedMessage.clientId;
                                log.logDebug(`this.connectedWalletPK  addPackageParse   ${this.connectedWalletPK}`);
                                // exchange sender public key
                                // cache wallet public key
                                this.connectStorage.saveContent(this.connectedWalletPK, storageconstants_1.OKXCONNECTOR_CRYPTO_SENDER_PK_CACHE);
                                // cache crypto keypair
                                this.saveCryptoKeyPair(this.crypto.stringifyKeypair());
                            }
                        }
                        // ignore receive echo
                        this.parsePackage(event, event.method === commands_1.CONNECT_METHOD_RECEIVE);
                    });
                }));
                this.connector.connect();
            });
        });
    }
    disconnect() {
        return __awaiter(this, arguments, void 0, function* (fromRestore = false) {
            yield this.connector.disconnect();
            //clean cached topic
            //如果是恢复连接，就不清理解密public key
            this.connectStorage.clearCache(storageconstants_1.OKXCONNECTOR_TOKEN_CACHE);
            if (!fromRestore) {
                this.connectStorage.clearCache(storageconstants_1.OKXCONNECTOR_CRYPTO_SENDER_PK_CACHE);
                this.connectedWalletPK = '';
            }
        });
    }
    addListener(event, success, fail) {
        this.connector.addListener((0, safejson_1.safeJsonStringify)(event), (rawMsg) => {
            rawMsg = rawMsg.replace(/'/g, '"');
            log.logDebug(`addListener ===> ${rawMsg}`);
            if (typeof rawMsg !== 'undefined') {
                var msgObj = (0, safejson_1.safeJsonParse)(rawMsg);
                var msg = msgObj.message;
                if (msgObj.clientId && msgObj.clientId.length > 0) {
                    this.connectedWalletPK = msgObj.clientId;
                    this.connectStorage.saveContent(this.connectedWalletPK, storageconstants_1.OKXCONNECTOR_CRYPTO_SENDER_PK_CACHE);
                    log.logDebug(`this.connectedWalletPK  addListener   ${this.connectedWalletPK}`);
                    // cache crypto keypair
                    this.saveCryptoKeyPair(this.crypto.stringifyKeypair());
                }
                var result = this.crypto.decrypt(msg, this.connectedWalletPK);
                log.logDebug(`addListener ===> ${result}`);
                return result;
            }
            return undefined;
        }, success, fail);
    }
    send(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            // make send msg payload
            log.logDebug(`message send =====> ${msg}`);
            if (!this.isWalletPKReady()) {
                // channel not ready
                throw new Error('connection not finish');
            }
            let message = this.crypto.encrypt(msg, this.connectedWalletPK);
            log.logDebug(`message send =====encrypt message.length>>>> ${message.length}`);
            // only one topic
            let topic = this.connectStorage.getItem(storageconstants_1.OKXCONNECTOR_TOKEN_CACHE);
            this.refreshPackageId();
            const payload = {
                id: this.packageId.toString(),
                method: commands_1.CONNECT_METHOD_PUBLISH,
                jsonrpc: constants_1.CONNECT_JSONRPC_VER,
                params: {
                    message: {
                        topic: topic === null || topic === void 0 ? void 0 : topic.content,
                        message: message,
                        ttl: constants_1.OKXCONNECTOR_MESSAGE_TTL
                    }
                } // crypted
            };
            this.events.once(this.packageId.toString(), (rsp) => __awaiter(this, void 0, void 0, function* () {
                // ack
                if (rsp && rsp.error) {
                    log.logError(`@${new Date().toUTCString()} >>> failed when send msg`);
                }
                else if (rsp && !rsp.error) {
                    log.logDebug(`CONNECTION @[${new Date().toUTCString()}] >>> send msg with id ${this.packageId} successed`);
                }
            }));
            yield this.connector.send(() => __awaiter(this, void 0, void 0, function* () {
                log.logDebug('CONNECT: reconnect before send');
                yield this.connector.connect();
            }), payload);
            return this.packageId;
        });
    }
    sendACK(msgId_1, success_1) {
        return __awaiter(this, arguments, void 0, function* (msgId, success, reason = undefined) {
            if (success === true) {
                const payload = {
                    id: msgId,
                    jsonrpc: constants_1.CONNECT_JSONRPC_VER,
                    result: true
                };
                yield this.connector.send(() => __awaiter(this, void 0, void 0, function* () {
                    log.logDebug('CONNECT: reconnect before send');
                    yield this.connector.connect();
                }), payload);
            }
            else if (reason) {
                const payload = {
                    id: msgId,
                    jsonrpc: constants_1.CONNECT_JSONRPC_VER,
                    error: {
                        code: reason.code, //int
                        message: reason.message
                    }
                };
                yield this.connector.send(() => __awaiter(this, void 0, void 0, function* () {
                    log.logDebug('CONNECT: reconnect before send');
                    yield this.connector.connect();
                }), payload);
            }
        });
    }
    // send receive
    sendReceive(msgId, messageId, topic) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = {
                id: msgId,
                jsonrpc: constants_1.CONNECT_JSONRPC_VER,
                method: commands_1.CONNECT_METHOD_RECEIVE,
                params: {
                    data: {
                        messageId: messageId,
                        topic: topic
                    }
                }
            };
            yield this.connector.send(() => __awaiter(this, void 0, void 0, function* () {
                log.logDebug('CONNECT: reconnect before send');
                yield this.connector.connect();
            }), payload);
        });
    }
    // send receive
    // 1. fetch all 
    // 2. send back receive
    // 3. check has more, if so, repeat from 1st step
    sendFetchAndConsumeMessages(msgId, topic) {
        return __awaiter(this, void 0, void 0, function* () {
            //1. send fetch
            this.events.once(msgId, (fetchedMessages) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b;
                //2. consume received messages
                if (fetchedMessages.result) {
                    var hasMore = fetchedMessages.result.hasMore;
                    var receivedMsgs = fetchedMessages.result.data;
                    if (receivedMsgs) {
                        for (let i = 0; i < receivedMsgs.length; i++) {
                            let msg = receivedMsgs[i];
                            if (msg && msg.topic == topic) {
                                let messageId = msg.messageId;
                                yield this.connector.getMsgPayloadFromHistory(msg);
                                // send receive command to relay server
                                this.refreshPackageId();
                                yield this.sendReceive(this.packageId.toString(), messageId, topic);
                            }
                        }
                    }
                    // 3. check hasmore
                    if (hasMore) {
                        this.refreshPackageId();
                        yield this.sendFetchAndConsumeMessages(this.packageId.toString(), topic);
                    }
                }
                else {
                    log.logDebug(`CONNECT: get error rsp ${(_a = fetchedMessages.error) === null || _a === void 0 ? void 0 : _a.code} : ${(_b = fetchedMessages.error) === null || _b === void 0 ? void 0 : _b.message}`);
                }
            }));
            log.logDebug('5. send fetch more');
            const timeFive = new Date().getTime();
            (0, log_1.logDebug)("ConnectTime---5->", timeFive - this.timeLog);
            const payload = {
                id: msgId,
                jsonrpc: constants_1.CONNECT_JSONRPC_VER,
                method: commands_1.CONNECT_METHOD_FETCHMSG,
                params: {
                    data: {
                        topic: topic
                    }
                }
            };
            yield this.connector.send(() => __awaiter(this, void 0, void 0, function* () {
                log.logDebug('CONNECT: reconnect before send');
                yield this.connector.connect();
            }), payload);
        });
    }
    cleanCache() {
        return __awaiter(this, void 0, void 0, function* () {
            this.connectStorage.clearCache();
        });
    }
    saveSessionContent(key, data) {
        if (!data) {
            this.connectStorage.clearCache(storageconstants_1.OKXCONNECTOR_SESSION_PREFIX_KEY + key);
        }
        let jsonData = (0, safejson_1.safeJsonStringify)(data);
        this.connectStorage.encryptStoreMsg(jsonData, storageconstants_1.OKXCONNECTOR_SESSION_PREFIX_KEY + key);
    }
    getSessionContent(key) {
        let jsonStr = this.connectStorage.getAndDecrypt(storageconstants_1.OKXCONNECTOR_SESSION_PREFIX_KEY + key);
        if (jsonStr) {
            let object = (0, safejson_1.safeJsonParse)(jsonStr);
            return object;
        }
        return undefined;
    }
}
exports.ConnectionManager = ConnectionManager;
