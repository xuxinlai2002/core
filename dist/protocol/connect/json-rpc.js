"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isJsonRpcPayload = isJsonRpcPayload;
exports.isJsonRpcRequest = isJsonRpcRequest;
exports.isJsonRpcResponse = isJsonRpcResponse;
exports.isJsonRpcResult = isJsonRpcResult;
exports.isJsonRpcError = isJsonRpcError;
exports.payloadId = payloadId;
exports.getBigIntRpcId = getBigIntRpcId;
exports.formatJsonRpcRequest = formatJsonRpcRequest;
exports.formatJsonRpcResult = formatJsonRpcResult;
exports.formatJsonRpcError = formatJsonRpcError;
exports.isReservedErrorCode = isReservedErrorCode;
exports.getError = getError;
exports.getErrorByCode = getErrorByCode;
exports.formatErrorMessage = formatErrorMessage;
exports.isHttpUrl = isHttpUrl;
exports.isWsUrl = isWsUrl;
exports.parseConnectionError = parseConnectionError;
function isJsonRpcPayload(payload) {
    return (typeof payload === "object" &&
        "id" in payload &&
        "jsonrpc" in payload &&
        payload.jsonrpc === "2.0");
}
function isJsonRpcRequest(payload) {
    return isJsonRpcPayload(payload) && "method" in payload;
}
function isJsonRpcResponse(payload) {
    return isJsonRpcPayload(payload) && (isJsonRpcResult(payload) || isJsonRpcError(payload));
}
function isJsonRpcResult(payload) {
    return "result" in payload;
}
function isJsonRpcError(payload) {
    return "error" in payload;
}
const okx_connect_error_1 = require("../error/okx-connect.error");
const tweetnacl_1 = __importDefault(require("tweetnacl"));
class IncrementalRandomGenerator {
    constructor(bits) {
        this.i = 1;
        const typedArray = bits === 8 ? new Uint8Array(1) : bits === 16 ? new Uint16Array(1) : new Uint32Array(1);
        this.initialValue = tweetnacl_1.default.randomBytes(bits / 8)[0];
    }
    getNextValue() {
        return this.initialValue + this.i++;
    }
}
const uint8Generator = new IncrementalRandomGenerator(8);
const uint16Generator = new IncrementalRandomGenerator(16);
function payloadId() {
    const date = Date.now() * 1000;
    const extra = uint8Generator.getNextValue();
    return date + extra;
}
function getBigIntRpcId() {
    const date = BigInt(Date.now()) * BigInt(1000000);
    const extra = BigInt(uint16Generator.getNextValue());
    return date + extra;
}
function formatJsonRpcRequest(method, params, id) {
    return {
        id: id || payloadId(),
        jsonrpc: "2.0",
        method,
        params,
    };
}
function formatJsonRpcResult(id, result) {
    return {
        id,
        jsonrpc: "2.0",
        result,
    };
}
function formatJsonRpcError(id, error, data) {
    return {
        id,
        jsonrpc: "2.0",
        error: formatErrorMessage(error, data),
    };
}
function isReservedErrorCode(code) {
    return okx_connect_error_1.RESERVED_ERROR_CODES.includes(code);
}
function getError(type) {
    if (!Object.keys(okx_connect_error_1.STANDARD_ERROR_MAP).includes(type)) {
        return okx_connect_error_1.STANDARD_ERROR_MAP[okx_connect_error_1.DEFAULT_ERROR];
    }
    return okx_connect_error_1.STANDARD_ERROR_MAP[type];
}
function getErrorByCode(code) {
    const match = Object.values(okx_connect_error_1.STANDARD_ERROR_MAP).find((e) => e.code === code);
    if (!match) {
        return okx_connect_error_1.STANDARD_ERROR_MAP[okx_connect_error_1.DEFAULT_ERROR];
    }
    return match;
}
function formatErrorMessage(error, data) {
    if (typeof error === "undefined") {
        return getError(okx_connect_error_1.INTERNAL_ERROR);
    }
    if (typeof error === "string") {
        error = Object.assign(Object.assign({}, getError(okx_connect_error_1.SERVER_ERROR)), { message: error });
    }
    if (typeof data !== "undefined") {
        error.data = data;
    }
    if (isReservedErrorCode(error.code)) {
        error = getErrorByCode(error.code);
    }
    return error;
}
function getUrlProtocol(url) {
    const matches = url.match(new RegExp(/^\w+:/, "gi"));
    if (!matches || !matches.length)
        return;
    return matches[0];
}
function matchRegexProtocol(url, regex) {
    const protocol = getUrlProtocol(url);
    if (typeof protocol === "undefined")
        return false;
    return new RegExp(regex).test(protocol);
}
function isHttpUrl(url) {
    return matchRegexProtocol(url, "^https?:");
}
function isWsUrl(url) {
    return matchRegexProtocol(url, "^wss?:");
}
function parseConnectionError(e, url, type) {
    return e.message.includes("getaddrinfo ENOTFOUND") || e.message.includes("connect ECONNREFUSED")
        ? new Error(`Unavailable ${type} RPC url at ${url}`)
        : e;
}
