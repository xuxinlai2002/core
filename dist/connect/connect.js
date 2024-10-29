"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function (o, m, k, k2) {
    if (k2 === undefined)
        k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function () { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function (o, m, k, k2) {
    if (k2 === undefined)
        k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function (o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function (o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule)
        return mod;
    var result = {};
    if (mod != null)
        for (var k in mod)
            if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
                __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try {
            step(generator.next(value));
        }
        catch (e) {
            reject(e);
        } }
        function rejected(value) { try {
            step(generator["throw"](value));
        }
        catch (e) {
            reject(e);
        } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OKXWalletConnector = void 0;
const constants_1 = require("./constants");
const utils_1 = require("../utils");
const utils_2 = require("../utils/utils");
const eventemitter3_1 = require("eventemitter3");
const log = __importStar(require("../utils/log"));
const WS = (0, utils_2.resolveWebSocketImplementation)();
class OKXWalletConnector {
    constructor(url) {
        this.events = new eventemitter3_1.EventEmitter();
        this.state = constants_1.ConnectorState.InitState;
        if (!(0, utils_2.checkWSUrl)(url)) {
            throw new Error(`CONNECTOR: invalid url ${url}`);
        }
        this.url = url;
        this.heartbeatTimer = null;
    }
    get connecting() {
        return this.state == constants_1.ConnectorState.Connecting;
    }
    // ------------------------------------------------------
    onPayload(e) {
        if (typeof e.data === "undefined")
            return;
        log.logDebug('get received data');
        log.logDebug(e);
        if (typeof e.data === "string") {
            let rsp = e.data;
            if (rsp === "pong") {
                log.logDebug(`CONNECT: receive pong ${Date.now().toString()}`);
                return;
            }
        }
        this.events.emit("payload", e.data);
    }
    onClose(event) {
        this.socket = undefined;
        this.events.emit("close", event);
    }
    onError(id, e) {
        const payload = { id: id, msg: e.toString() };
        this.events.emit("payload", payload);
    }
    onopen(socket) {
        socket.onmessage = (event) => this.onPayload(event);
        socket.onclose = (event) => this.onClose(event);
        this.socket = socket;
        this.state = constants_1.ConnectorState.Connected;
        this.events.emit("open");
    }
    // ------------------------------------------------------
    emitError(errorEvent) {
        this.events.emit("fail", errorEvent);
    }
    // ------------------------------------------------------
    heartbeat() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.heartbeatTimer) {
                clearTimeout(this.heartbeatTimer);
            }
            if (this.state != constants_1.ConnectorState.Connected && this.state != constants_1.ConnectorState.OnError) {
                log.logDebug('heart beat close');
                return;
            }
            if (!this.socket) {
                log.logDebug('socket not exist');
                if (this.state == constants_1.ConnectorState.Connected || this.state == constants_1.ConnectorState.OnError) {
                    log.logDebug('socket reconnect by heartbeat');
                    try {
                        yield this.registOpen();
                    }
                    catch (e) {
                        log.logError('regist open failed');
                        this.heartbeatTimer = setTimeout(this.heartbeat.bind(this), 5000);
                    }
                }
                return;
            }
            if (this.socket.readyState !== WebSocket.OPEN) {
                log.logDebug('socket not ready');
                if (this.state == constants_1.ConnectorState.Connected || this.state == constants_1.ConnectorState.OnError) {
                    log.logDebug('socket reconnect by heartbeat');
                    try {
                        yield this.registOpen();
                    }
                    catch (e) {
                        log.logError('regist open failed');
                        this.heartbeatTimer = setTimeout(this.heartbeat.bind(this), 5000);
                    }
                }
                return;
            }
            log.logDebug(`send ping heart beat: ${Date.now().toString()}, ${this.socket}`);
            this.socket.send("ping");
            this.heartbeatTimer = setTimeout(this.heartbeat.bind(this), 5000);
        });
    }
    registOpen(url = this.url) {
        if (!(0, utils_2.checkWSUrl)(url)) {
            throw new Error(`CONNECTOR: invalid url ${url}`);
        }
        if (this.connecting) {
            /// event observer limits
            // const maxListenerCount = this.events.getMaxListeners()
            // if (this.events.listenerCount("open") >= maxListenerCount ||
            //         this.events.listenerCount("fail") >= maxListenerCount) {
            //     this.events.setMaxListeners(maxListenerCount + 1)
            // }
            return new Promise((resolve, reject) => {
                this.events.once("fail", (error) => {
                    // if (this.events.getMaxListeners() > EVENT_EMITTER_MAX_LISTENERS) {
                    //     this.events.setMaxListeners(EVENT_EMITTER_MAX_LISTENERS)
                    // }
                    reject(error);
                });
                this.events.once("open", () => {
                    // if (this.events.getMaxListeners() > EVENT_EMITTER_MAX_LISTENERS) {
                    //     this.events.setMaxListeners(EVENT_EMITTER_MAX_LISTENERS)
                    // }
                    if (typeof this.socket == "undefined") {
                        return reject(new Error("Connect lost"));
                    }
                    resolve(this.socket);
                });
            });
        }
        this.url = url;
        this.state = constants_1.ConnectorState.Connecting;
        const origin = new URLSearchParams(url).get("origin");
        return new Promise((resolve, reject) => {
            const socket = new WS(url, []);
            if ((0, utils_2.hasBuiltInWebSocket)()) {
                socket.onerror = (event) => {
                    const errorEvent = event;
                    this.state = constants_1.ConnectorState.OnError;
                    this.emitError(errorEvent.error);
                    reject(new Error(errorEvent.message));
                };
            }
            else {
                socket.on("error", (errorEvent) => {
                    this.state = constants_1.ConnectorState.OnError;
                    this.emitError(errorEvent);
                    reject(new Error('socketError'));
                });
            }
            socket.onopen = () => {
                log.logDebug('socket opened');
                this.onopen(socket);
                this.heartbeat();
                resolve(socket);
            };
        });
    }
    // ------------------------------------------------------
    onVisibleChanged() {
        return __awaiter(this, void 0, void 0, function* () {
            if (document.visibilityState === 'visible') {
                // check and restore
                log.logDebug(`get changed ${this.state}, ${this.socket}`);
                if (this.state == constants_1.ConnectorState.Connected && typeof this.socket === "undefined") {
                    log.logDebug('CONNECTION need reopen');
                    try {
                        yield this.registOpen();
                    }
                    catch (e) {
                        log.logError('regist open failed');
                    }
                    return;
                }
            }
        });
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.registOpen(this.url);
            // listener for reconnect
            document.removeEventListener('visibilitychange', this.onVisibleChanged.bind(this));
            document.addEventListener('visibilitychange', this.onVisibleChanged.bind(this));
        });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            this.state = constants_1.ConnectorState.Disconnected;
            return new Promise((resolve, reject) => {
                if (typeof this.socket === "undefined") {
                    // reject(new Error("CONNECTION closed"))
                    resolve();
                    return;
                }
                this.socket.onclose = (event) => {
                    this.onClose(event);
                    resolve();
                };
                this.socket.close();
                if (this.heartbeatTimer) {
                    clearTimeout(this.heartbeatTimer);
                }
            });
        });
    }
    currentStatus() {
        return {
            state: this.state,
            url: this.url
        };
    }
    // event will be jsonstr
    /// @params Promise
    /// @params success/failed callback
    addListener(event, decrypt, success, failed) {
        if (this.listenPayloadHandler) {
            this.events.removeListener("payload", this.listenPayloadHandler);
        }
        this.listenPayloadHandler = (e) => {
            var _a;
            log.logDebug(`<<< get payload ${e}`);
            let parsedEvent = (0, utils_1.safeJsonParse)(e);
            // parse the data to chose success or failed
            if (parsedEvent.params && parsedEvent.params.data) {
                let rawMsg = (_a = parsedEvent.params.data) === null || _a === void 0 ? void 0 : _a.message;
                if (rawMsg) {
                    try {
                        let msg = decrypt(rawMsg);
                        if (msg === undefined) {
                            log.logDebug(`CONNECT: decrypt undefined`);
                            failed(event, 'Decrypt undefined');
                        }
                        else {
                            success(event, msg);
                        }
                    }
                    catch (e) {
                        log.logDebug(`CONNECT: decrypt failed: ${e}`);
                        failed(event, e.message);
                    }
                }
            }
        };
        this.events.on("payload", this.listenPayloadHandler);
        if (this.failHandler) {
            this.events.removeListener("fail", this.failHandler);
        }
        this.failHandler = (e) => {
            if (e) {
                log.logDebug(`CONNECT failed: ${e}`);
                failed(event, e.message);
            }
            else {
                failed(event, "Unkonow error");
            }
        };
        this.events.on("fail", this.failHandler);
    }
    addPackageParse(callback) {
        if (this.payloadHandler) {
            this.events.removeListener("payload", this.payloadHandler);
        }
        this.payloadHandler = (e) => __awaiter(this, void 0, void 0, function* () {
            // parse the data to chose success or failed
            log.logDebug(`CONNECTION @[${new Date().toUTCString()}] <<<< received e:${e}`);
            let param = (0, utils_1.safeJsonParse)(e);
            yield callback(param);
        });
        this.events.on("payload", this.payloadHandler);
    }
    once(event, listener) {
        this.events.once(event, listener);
    }
    off(event, listener) {
        this.events.off(event, listener);
    }
    removeListener(event, listener) {
        this.events.removeListener(event, listener);
    }
    send(doLogin, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof this.socket === "undefined") {
                log.logDebug(`>>> send payload undefined ${payload}`);
                // this.socket = await this.registOpen();
                yield doLogin();
            }
            try {
                log.logDebug(`CONNECTION @[${new Date().toUTCString()}]>>> send payload ${(0, utils_1.safeJsonStringify)(payload)}`);
                if (this.socket) {
                    this.socket.send((0, utils_1.safeJsonStringify)(payload));
                }
            }
            catch (e) {
                this.onError(payload.id, e);
            }
        });
    }
    getMsgPayloadFromHistory(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof msg === "undefined")
                return;
            let tmpMsg = {
                params: {
                    data: msg
                }
            };
            let jsonstr = (0, utils_1.safeJsonStringify)(msg);
            log.logDebug('get received data from history');
            log.logDebug(jsonstr);
            jsonstr = (0, utils_1.safeJsonStringify)(tmpMsg);
            this.events.emit("payload", jsonstr);
        });
    }
    onOpen(callback) {
        if (this.openHandler) {
            this.events.removeListener("open", this.openHandler);
        }
        this.openHandler = () => __awaiter(this, void 0, void 0, function* () {
            log.logDebug(`CONNECTION @[${new Date().toUTCString()}] >>> ws opened: `);
            yield callback();
        });
        this.events.on("open", this.openHandler);
    }
}
exports.OKXWalletConnector = OKXWalletConnector;
