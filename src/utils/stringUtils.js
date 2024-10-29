"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.okxfromString = okxfromString;
exports.okxtoString = okxtoString;
exports.alloc = alloc;
exports.allocUnsafe = allocUnsafe;
const basics_1 = require("multiformats/basics");
const log_1 = require("../utils/log");
function okxfromString(string, encoding = 'utf8') {
    const base = BASES[encoding];
    (0, log_1.logDebug)("okxfromstring ====> ");
    if (!base) {
        throw new Error(`Unsupported encoding "${encoding}"`);
    }
    return base.decoder.decode(`${base.prefix}${string}`);
}
function okxtoString(array, encoding = 'utf8') {
    const base = BASES[encoding];
    (0, log_1.logDebug)("okxtoString ====> ");
    if (!base) {
        throw new Error(`Unsupported encoding "${encoding}"`);
    }
    return base.encoder.encode(array).substring(1);
}
function alloc(size = 0) {
    return new Uint8Array(size);
}
function allocUnsafe(size = 0) {
    return new Uint8Array(size);
}
function createCodec(name, prefix, encode, decode) {
    return {
        name,
        prefix,
        encoder: {
            name,
            prefix,
            encode
        },
        decoder: { decode }
    };
}
const string = createCodec('utf8', 'u', buf => {
    const decoder = new TextDecoder('utf8');
    return 'u' + decoder.decode(buf);
}, str => {
    const encoder = new TextEncoder();
    return encoder.encode(str.substring(1));
});
const ascii = createCodec('ascii', 'a', buf => {
    let result = 'a';
    for (let i = 0; i < buf.length; i++) {
        result += String.fromCharCode(buf[i]);
    }
    return result;
}, str => {
    str = str.substring(1);
    const buf = allocUnsafe(str.length);
    for (let i = 0; i < str.length; i++) {
        buf[i] = str.charCodeAt(i);
    }
    return buf;
});
const BASES = Object.assign({ utf8: string, 'utf-8': string, hex: basics_1.bases.base16, latin1: ascii, ascii: ascii, binary: ascii }, basics_1.bases);
