"use strict";
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
exports.Engine = void 0;
const call_for_success_1 = require("../utils/call-for-success");
const safejson_1 = require("../utils/safejson");
const log_1 = require("../utils/log");
const protocol_1 = require("../protocol");
// import {standardDeeplink, tonConnectSdkVersion} from "../../ton/tonsdk/constants/version";
const utils_1 = require("../utils");
const utils_2 = require("../utils");
const sessionUtils_1 = require("./sessionUtils");
class Engine {
    constructor(connectionManager) {
        this.pendingRequests = new Map();
        this.disconnectListener = [];
        this.connectionManager = connectionManager;
        this.connectionManager.addListener("sdk_response", (event, msg) => {
            var jsonResponse = (0, safejson_1.safeJsonParse)(msg);
            (0, log_1.logDebug)(`Engine ==>> addListener ==> success ==> ${jsonResponse}`);
            this.handleResponse(event, jsonResponse);
        }, function () {
        });
    }
    addDisconnectListener(disconnecter) {
        this.disconnectListener.push(disconnecter);
    }
    disconnect() {
        (0, log_1.logDebug)('Engine ==>> disconnect');
        this.pendingRequests.clear();
    }
    getRequestId() {
        const requestId = Date.now().toString();
        (0, log_1.logDebug)('Engine ==>> getRequestId ==>', requestId);
        return requestId;
    }
    bindRequestForPromise(requestId, resolve) {
        this.pendingRequests.set(requestId, resolve);
    }
    send(request, requestAnswer, option) {
        return __awaiter(this, void 0, void 0, function* () {
            const requestId = this.getRequestId();
            let packageId = yield (0, call_for_success_1.callForSuccess)(() => this.connectionManager.send(JSON.stringify(Object.assign(Object.assign({}, request), { requestId: requestId }))), option);
            this.connectionManager.events.once(packageId.toString(), (event) => {
                var _a;
                (0, log_1.logDebug)(`Engine ==> send => onAck => ${(0, safejson_1.safeJsonStringify)(event)}`);
                if (event && event.result) {
                    (_a = requestAnswer.onAck) === null || _a === void 0 ? void 0 : _a.call(requestAnswer);
                }
            });
            if (requestAnswer.resolve) {
                this.bindRequestForPromise(requestId, requestAnswer.resolve);
            }
        });
    }
    handleResponse(event, response) {
        (0, log_1.logDebug)(`Engine ==>> handleResponse_1  ======>response: ${(0, safejson_1.safeJsonStringify)(response)}`, event);
        if ("requestId" in response) {
            (0, log_1.logDebug)("Engine ==>> handleResponse_2  ===> in response");
            let requestId = response.requestId;
            const resolve = this.pendingRequests.get(requestId);
            if (resolve) {
                (0, log_1.logDebug)("Engine ==>> handleResponse_3  ===> find resolve:", resolve);
                resolve(response);
                // 从pendingRequests中删除这个Promise
                this.pendingRequests.delete(requestId);
            }
            else {
                (0, log_1.logDebug)("Engine ==>> handleResponse_3  ===> not find resolve:");
                if (response.method === "disconnect") {
                    this.disconnectListener.forEach(listener => listener());
                    this.disconnectListener = [];
                    this.disconnect();
                }
            }
        }
    }
    restoreconnect(sessionInfo, onConnectResult) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            yield ((_a = this.connectionManager) === null || _a === void 0 ? void 0 : _a.restoreConnect(sessionInfo.topic));
            onConnectResult(sessionInfo);
        });
    }
    conect(request, sessionConfig, onConnectResult) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const connectInfo = this.connectionManager.getConnectInfo();
            const requestId = this.getRequestId();
            let openUniversalLink = (_a = sessionConfig.openUniversalUrl) !== null && _a !== void 0 ? _a : false;
            const connectRequest = {
                protocolVer: Number(protocol_1.tonConnectSdkVersion),
                topic: connectInfo.channelId,
                clientId: connectInfo.clientId,
                requestId: requestId,
                dAppInfo: sessionConfig.dappInfo,
                requests: request,
                redirect: (_b = sessionConfig === null || sessionConfig === void 0 ? void 0 : sessionConfig.redirect) !== null && _b !== void 0 ? _b : "none"
            };
            const connectRequestStr = JSON.stringify(connectRequest);
            const utf8Array = new TextEncoder().encode(connectRequestStr);
            const base64Encoded = btoa(String.fromCharCode(...utf8Array));
            const deeplinkUrl = `${protocol_1.standardDeeplink}?param=${base64Encoded}`;
            (0, log_1.logDebug)('engine ==>> connect ==>>deeplinkUrl:', deeplinkUrl);
            const isIOS = (0, utils_2.isIos)();
            (0, log_1.logDebug)(`engine ==>> connect ==>>isIOS: ${isIOS}   openUniversalLink: ${openUniversalLink}`);
            if (isIOS && openUniversalLink) {
                (0, utils_1.openOKXDeeplinkWithFallback)(deeplinkUrl);
            }
            yield ((_c = this.connectionManager) === null || _c === void 0 ? void 0 : _c.disconnect(false));
            this.bindRequestForPromise(requestId, (response) => {
                let session = this.onConnect(response, sessionConfig, connectInfo.channelId);
                onConnectResult(session, response);
            });
            yield this.connectionManager.connect();
            if (!isIOS && openUniversalLink) {
                (0, utils_1.openOKXDeeplinkWithFallback)(deeplinkUrl);
            }
            return {
                connectInfo: connectInfo,
                deeplinkUrl: (0, utils_1.getUniversalLink)(deeplinkUrl)
            };
        });
    }
    onConnect(connectResponse, sessionConfig, topic) {
        if (connectResponse.method == "connect") {
            let namespaces = (0, sessionUtils_1.buildNameSpacesByConnectResponse)(connectResponse);
            if (namespaces) {
                let session = {
                    topic: topic,
                    sessionConfig: sessionConfig,
                    namespaces: namespaces
                };
                return session;
            }
        }
        return null;
    }
}
exports.Engine = Engine;
