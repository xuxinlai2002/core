"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_ERROR = exports.STANDARD_ERROR_MAP = exports.SERVER_ERROR_CODE_RANGE = exports.RESERVED_ERROR_CODES = exports.SERVER_ERROR = exports.INTERNAL_ERROR = exports.INVALID_PARAMS = exports.METHOD_NOT_FOUND = exports.INVALID_REQUEST = exports.PARSE_ERROR = exports.OKX_CONNECT_ERROR_CODES = exports.OKXConnectError = void 0;
class OKXConnectError extends Error {
    constructor(code, message) {
        if (message == undefined) {
            message = getDefaultMessageByCode(code);
        }
        super(message);
        this.code = code;
        this.message = `${OKXConnectError.prefix} ${message ? '\n' + message : ''}`;
        Object.setPrototypeOf(this, OKXConnectError.prototype);
    }
}
exports.OKXConnectError = OKXConnectError;
OKXConnectError.prefix = '[OKX_CONNECT_SDK_ERROR]';
function getDefaultMessageByCode(code) {
    if (code == OKX_CONNECT_ERROR_CODES.UNKNOWN_ERROR) {
        return "unknown error";
    }
    else if (code == OKX_CONNECT_ERROR_CODES.BAD_REQUEST_ERROR) {
        return "bad request error";
    }
    else if (code == OKX_CONNECT_ERROR_CODES.ALREADY_CONNECTED_ERROR) {
        return "already connected error";
    }
    else if (code == OKX_CONNECT_ERROR_CODES.NOT_CONNECTED_ERROR) {
        return "not connected error";
    }
    else if (code == OKX_CONNECT_ERROR_CODES.UNKNOWN_APP_ERROR) {
        return "unknown app error";
    }
    else if (code == OKX_CONNECT_ERROR_CODES.USER_REJECTS_ERROR) {
        return "user rejects error";
    }
    else if (code == OKX_CONNECT_ERROR_CODES.METHOD_NOT_SUPPORTED) {
        return "method not supported";
    }
    return "unknown error";
}
var OKX_CONNECT_ERROR_CODES;
(function (OKX_CONNECT_ERROR_CODES) {
    OKX_CONNECT_ERROR_CODES[OKX_CONNECT_ERROR_CODES["UNKNOWN_ERROR"] = 0] = "UNKNOWN_ERROR";
    OKX_CONNECT_ERROR_CODES[OKX_CONNECT_ERROR_CODES["BAD_REQUEST_ERROR"] = 1] = "BAD_REQUEST_ERROR";
    OKX_CONNECT_ERROR_CODES[OKX_CONNECT_ERROR_CODES["ALREADY_CONNECTED_ERROR"] = 11] = "ALREADY_CONNECTED_ERROR";
    OKX_CONNECT_ERROR_CODES[OKX_CONNECT_ERROR_CODES["NOT_CONNECTED_ERROR"] = 12] = "NOT_CONNECTED_ERROR";
    OKX_CONNECT_ERROR_CODES[OKX_CONNECT_ERROR_CODES["UNKNOWN_APP_ERROR"] = 100] = "UNKNOWN_APP_ERROR";
    OKX_CONNECT_ERROR_CODES[OKX_CONNECT_ERROR_CODES["USER_REJECTS_ERROR"] = 300] = "USER_REJECTS_ERROR";
    OKX_CONNECT_ERROR_CODES[OKX_CONNECT_ERROR_CODES["METHOD_NOT_SUPPORTED"] = 400] = "METHOD_NOT_SUPPORTED";
    OKX_CONNECT_ERROR_CODES[OKX_CONNECT_ERROR_CODES["CHAIN_NOT_SUPPORTED"] = 500] = "CHAIN_NOT_SUPPORTED";
    OKX_CONNECT_ERROR_CODES[OKX_CONNECT_ERROR_CODES["WALLET_NOT_SUPPORTED"] = 600] = "WALLET_NOT_SUPPORTED";
})(OKX_CONNECT_ERROR_CODES || (exports.OKX_CONNECT_ERROR_CODES = OKX_CONNECT_ERROR_CODES = {}));
exports.PARSE_ERROR = "PARSE_ERROR";
exports.INVALID_REQUEST = "INVALID_REQUEST";
exports.METHOD_NOT_FOUND = "METHOD_NOT_FOUND";
exports.INVALID_PARAMS = "INVALID_PARAMS";
exports.INTERNAL_ERROR = "INTERNAL_ERROR";
exports.SERVER_ERROR = "SERVER_ERROR";
exports.RESERVED_ERROR_CODES = [-32700, -32600, -32601, -32602, -32603];
exports.SERVER_ERROR_CODE_RANGE = [-32000, -32099];
exports.STANDARD_ERROR_MAP = {
    [exports.PARSE_ERROR]: { code: -32700, message: "Parse error" },
    [exports.INVALID_REQUEST]: { code: -32600, message: "Invalid Request" },
    [exports.METHOD_NOT_FOUND]: { code: -32601, message: "Method not found" },
    [exports.INVALID_PARAMS]: { code: -32602, message: "Invalid params" },
    [exports.INTERNAL_ERROR]: { code: -32603, message: "Internal error" },
    [exports.SERVER_ERROR]: { code: -32000, message: "Server error" },
};
exports.DEFAULT_ERROR = exports.SERVER_ERROR;
