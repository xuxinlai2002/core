"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBrowser = exports.isOS = exports.isMobileUserAgent = exports.openDeeplinkWithFallback = exports.openLinkBlank = exports.openLink = exports.isValidObject = exports.isIos = exports.base64decode = exports.base64encode = exports.splitToUint8Arrays = exports.concatUint8Arrays = exports.toHexString = exports.hexToByteArray = exports.openOKXDeeplinkWithFallback = exports.getUniversalLink = exports.safeJsonStringify = exports.safeJsonParse = exports.logWarning = exports.logError = exports.logDebug = exports.callForSuccess = void 0;
var call_for_success_1 = require("./call-for-success");
Object.defineProperty(exports, "callForSuccess", { enumerable: true, get: function () { return call_for_success_1.callForSuccess; } });
var log_1 = require("./log");
Object.defineProperty(exports, "logDebug", { enumerable: true, get: function () { return log_1.logDebug; } });
Object.defineProperty(exports, "logError", { enumerable: true, get: function () { return log_1.logError; } });
Object.defineProperty(exports, "logWarning", { enumerable: true, get: function () { return log_1.logWarning; } });
var safejson_1 = require("./safejson");
Object.defineProperty(exports, "safeJsonParse", { enumerable: true, get: function () { return safejson_1.safeJsonParse; } });
Object.defineProperty(exports, "safeJsonStringify", { enumerable: true, get: function () { return safejson_1.safeJsonStringify; } });
var url_1 = require("./url");
Object.defineProperty(exports, "getUniversalLink", { enumerable: true, get: function () { return url_1.getUniversalLink; } });
Object.defineProperty(exports, "openOKXDeeplinkWithFallback", { enumerable: true, get: function () { return url_1.openOKXDeeplinkWithFallback; } });
var utils_1 = require("./utils");
Object.defineProperty(exports, "hexToByteArray", { enumerable: true, get: function () { return utils_1.hexToByteArray; } });
Object.defineProperty(exports, "toHexString", { enumerable: true, get: function () { return utils_1.toHexString; } });
Object.defineProperty(exports, "concatUint8Arrays", { enumerable: true, get: function () { return utils_1.concatUint8Arrays; } });
Object.defineProperty(exports, "splitToUint8Arrays", { enumerable: true, get: function () { return utils_1.splitToUint8Arrays; } });
Object.defineProperty(exports, "base64encode", { enumerable: true, get: function () { return utils_1.base64encode; } });
Object.defineProperty(exports, "base64decode", { enumerable: true, get: function () { return utils_1.base64decode; } });
Object.defineProperty(exports, "isIos", { enumerable: true, get: function () { return utils_1.isIos; } });
Object.defineProperty(exports, "isValidObject", { enumerable: true, get: function () { return utils_1.isValidObject; } });
var web_api_1 = require("./web-api");
Object.defineProperty(exports, "openLink", { enumerable: true, get: function () { return web_api_1.openLink; } });
Object.defineProperty(exports, "openLinkBlank", { enumerable: true, get: function () { return web_api_1.openLinkBlank; } });
Object.defineProperty(exports, "openDeeplinkWithFallback", { enumerable: true, get: function () { return web_api_1.openDeeplinkWithFallback; } });
Object.defineProperty(exports, "isMobileUserAgent", { enumerable: true, get: function () { return web_api_1.isMobileUserAgent; } });
Object.defineProperty(exports, "isOS", { enumerable: true, get: function () { return web_api_1.isOS; } });
Object.defineProperty(exports, "isBrowser", { enumerable: true, get: function () { return web_api_1.isBrowser; } });