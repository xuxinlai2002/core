"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidObject = exports.RANDOM_LENGTH = exports.isBrowser = exports.resolveLocalStorage = exports.hasLocalStorage = exports.hasBuiltInWebSocket = exports.resolveWebSocketImplementation = void 0;
exports.hexToByteArray = hexToByteArray;
exports.toHexString = toHexString;
exports.concatUint8Arrays = concatUint8Arrays;
exports.splitToUint8Arrays = splitToUint8Arrays;
exports.base64encode = base64encode;
exports.base64decode = base64decode;
exports.checkWSUrl = checkWSUrl;
exports.hashKey = hashKey;
exports.generateRandomBytes32 = generateRandomBytes32;
exports.generateTopic = generateTopic;
exports.isIos = isIos;
const tweetnacl_1 = __importDefault(require("tweetnacl"));
const tweetnacl_util_1 = __importDefault(require("tweetnacl-util"));
const to_string_1 = require("uint8arrays/to-string");
const sha256_1 = require("@stablelib/sha256");
const safejson_1 = require("./safejson");
const log_1 = require("./log");
const stringUtils_1 = require("../utils/stringUtils");
const BASE16 = "base16";
function hexToByteArray(hexString) {
    if (hexString.length % 2 !== 0) {
        throw new Error(`Cannot convert ${hexString} to bytesArray`);
    }
    const result = new Uint8Array(hexString.length / 2);
    for (let i = 0; i < hexString.length; i += 2) {
        result[i / 2] = parseInt(hexString.slice(i, i + 2), 16);
    }
    return result;
}
function toHexString(byteArray) {
    let hexString = '';
    byteArray.forEach(byte => {
        hexString += ('0' + (byte & 0xff).toString(16)).slice(-2);
    });
    return hexString;
}
function concatUint8Arrays(buffer1, buffer2) {
    const mergedArray = new Uint8Array(buffer1.length + buffer2.length);
    mergedArray.set(buffer1);
    mergedArray.set(buffer2, buffer1.length);
    return mergedArray;
}
function splitToUint8Arrays(array, index) {
    if (index >= array.length) {
        throw new Error('Index is out of buffer');
    }
    const subArray1 = array.slice(0, index);
    const subArray2 = array.slice(index);
    return [subArray1, subArray2];
}
function encodeUint8Array(value, urlSafe) {
    const encoded = tweetnacl_util_1.default.encodeBase64(value);
    if (!urlSafe) {
        return encoded;
    }
    return encodeURIComponent(encoded);
}
function decodeToUint8Array(value, urlSafe) {
    if (urlSafe) {
        value = decodeURIComponent(value);
    }
    return tweetnacl_util_1.default.decodeBase64(value);
}
function base64encode(value, urlSafe) {
    let uint8Array;
    if (value instanceof Uint8Array) {
        uint8Array = value;
    }
    else {
        if (typeof value !== 'string') {
            value = (0, safejson_1.safeJsonStringify)(value);
        }
        uint8Array = tweetnacl_util_1.default.decodeUTF8(value);
    }
    return encodeUint8Array(uint8Array, urlSafe);
}
function base64decode(value, urlSafe) {
    const decodedUint8Array = decodeToUint8Array(value, urlSafe);
    return {
        toString() {
            return tweetnacl_util_1.default.encodeUTF8(decodedUint8Array);
        },
        toObject() {
            try {
                return (0, safejson_1.safeJsonParse)(tweetnacl_util_1.default.encodeUTF8(decodedUint8Array));
            }
            catch (e) {
                return null;
            }
        },
        toUint8Array() {
            return decodedUint8Array;
        }
    };
}
function checkWSUrl(url) {
    const match = url.match(new RegExp(/^\w+:/, "gi"));
    if (!match || !match.length) {
        return false;
    }
    let scheme = match[0];
    if (scheme === undefined) {
        return false;
    }
    return new RegExp("^wss?:").test(scheme);
}
const resolveWebSocketImplementation = () => {
    if (typeof WebSocket !== "undefined") {
        return WebSocket;
    }
    else if (typeof global !== "undefined" && typeof global.WebSocket !== "undefined") {
        return global.WebSocket;
    }
    else if (typeof window !== "undefined" && typeof window.WebSocket !== "undefined") {
        return window.WebSocket;
    }
    else if (typeof self !== "undefined" && typeof self.WebSocket !== "undefined") {
        return self.WebSocket;
    }
    return WebSocket;
    //
    // return require("ws");
};
exports.resolveWebSocketImplementation = resolveWebSocketImplementation;
const hasBuiltInWebSocket = () => typeof WebSocket !== "undefined" ||
    (typeof global !== "undefined" && typeof global.WebSocket !== "undefined") ||
    (typeof window !== "undefined" && typeof window.WebSocket !== "undefined") ||
    (typeof self !== "undefined" && typeof self.WebSocket !== "undefined");
exports.hasBuiltInWebSocket = hasBuiltInWebSocket;
const hasLocalStorage = () => (typeof global !== "undefined" && (typeof global.localStorage !== "undefined")) ||
    (typeof window !== "undefined" && typeof window.localStorage !== "undefined");
exports.hasLocalStorage = hasLocalStorage;
const resolveLocalStorage = () => {
    if (typeof global !== "undefined" && typeof global.localStorage !== "undefined") {
        return global.localStorage;
    }
    else if (typeof window !== "undefined" && typeof window.localStorage !== "undefined") {
        return window.localStorage;
    }
    return localStorage;
};
exports.resolveLocalStorage = resolveLocalStorage;
const isBrowser = () => typeof window !== "undefined";
exports.isBrowser = isBrowser;
exports.RANDOM_LENGTH = 32;
function hashKey(key, encode = BASE16) {
    (0, log_1.logDebug)(`hash key called ${key}`);
    const result = (0, sha256_1.hash)((0, stringUtils_1.okxfromString)(key, encode));
    return (0, to_string_1.toString)(result, encode);
}
function generateRandomBytes32() {
    return tweetnacl_1.default.randomBytes(exports.RANDOM_LENGTH);
}
function generateTopic() {
    let randomBytes32 = generateRandomBytes32();
    (0, log_1.logDebug)(`generate topic called ${randomBytes32}`);
    return hashKey((0, to_string_1.toString)(randomBytes32, BASE16));
}
const isValidObject = (obj) => Object.getPrototypeOf(obj) === Object.prototype && Object.keys(obj).length;
exports.isValidObject = isValidObject;
function isIos() {
    const userAgent = navigator.userAgent;
    const maxTouchPoints = navigator.maxTouchPoints || 0;
    // 检测 iPhone、iPod 和传统的 iPad
    const isIOSDevice = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
    // 针对 iPadOS 13 及以上的设备进行额外判断
    const isIPadOS = (userAgent.includes('Mac') && maxTouchPoints > 1);
    (0, log_1.logDebug)(`utils isIos >>>isIOSDevice: ${isIOSDevice}    >> isIPadOS: ${isIPadOS}`);
    // 如果是 iOS 设备或者是 iPadOS 设备，返回 true
    return isIOSDevice || isIPadOS;
}
