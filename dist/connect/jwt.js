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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MULTICODEC_ED25519_LENGTH = exports.MULTICODEC_ED25519_HEADER = exports.MULTICODEC_ED25519_BASE = exports.MULTICODEC_ED25519_ENCODING = exports.DID_METHOD = exports.DID_PREFIX = exports.DID_DELIMITER = exports.KEY_PAIR_SEED_LENGTH = exports.DATA_ENCODING = exports.JSON_ENCODING = exports.JWT_ENCODING = exports.JWT_DELIMITER = exports.JWT_IRIDIUM_TYP = exports.JWT_IRIDIUM_ALG = exports.JWTHeaderType = void 0;
exports.generateKeyPair = generateKeyPair;
exports.decodeJSON = decodeJSON;
exports.encodeJSON = encodeJSON;
exports.encodeIss = encodeIss;
exports.decodeIss = decodeIss;
exports.encodeSig = encodeSig;
exports.decodeSig = decodeSig;
exports.encodeData = encodeData;
exports.decodeData = decodeData;
exports.encodeJWT = encodeJWT;
exports.decodeJWT = decodeJWT;
exports.signJWT = signJWT;
exports.verifyJWT = verifyJWT;
const ed25519 = __importStar(require("@stablelib/ed25519"));
const safejson_1 = require("../utils/safejson");
const utils_1 = require("../utils/utils");
const tweetnacl_1 = __importDefault(require("tweetnacl"));
const log = __importStar(require("../utils/log"));
const stringUtils_1 = require("../utils/stringUtils");
exports.JWTHeaderType = "dapp";
exports.JWT_IRIDIUM_ALG = "EdDSA";
exports.JWT_IRIDIUM_TYP = "JWT";
exports.JWT_DELIMITER = ".";
exports.JWT_ENCODING = "base64url";
exports.JSON_ENCODING = "utf8";
exports.DATA_ENCODING = "utf8";
exports.KEY_PAIR_SEED_LENGTH = 32;
exports.DID_DELIMITER = ":";
exports.DID_PREFIX = "did";
exports.DID_METHOD = "key";
exports.MULTICODEC_ED25519_ENCODING = "base58btc";
exports.MULTICODEC_ED25519_BASE = "z";
exports.MULTICODEC_ED25519_HEADER = "K36";
exports.MULTICODEC_ED25519_LENGTH = 32;
function generateKeyPair() {
    // let local_seed = randomBytes(KEY_PAIR_SEED_LENGTH)
    // return ed25519.generateKeyPairFromSeed(local_seed);
    return tweetnacl_1.default.sign.keyPair();
}
function decodeJSON(str) {
    return (0, safejson_1.safeJsonParse)((0, stringUtils_1.okxtoString)((0, stringUtils_1.okxfromString)(str, exports.JWT_ENCODING), exports.JSON_ENCODING));
}
function encodeJSON(val) {
    return (0, stringUtils_1.okxtoString)((0, stringUtils_1.okxfromString)((0, safejson_1.safeJsonStringify)(val), exports.JSON_ENCODING), exports.JWT_ENCODING);
}
function encodeIss(publicKey) {
    log.logDebug(`publicKey: ${(0, utils_1.toHexString)(publicKey)}`);
    var publicKeyStr = (0, stringUtils_1.okxtoString)(publicKey, exports.MULTICODEC_ED25519_ENCODING);
    return [exports.DID_PREFIX, exports.DID_METHOD, publicKeyStr].join(exports.DID_DELIMITER);
}
function decodeIss(issuer) {
    const [prefix, method, multicodec] = issuer.split(exports.DID_DELIMITER);
    if (prefix !== exports.DID_PREFIX || method !== exports.DID_METHOD) {
        throw new Error(`Issuer must be a DID with method "key"`);
    }
    if (multicodec === undefined) {
        throw new Error('multicodec is undefined');
    }
    const publicKey = (0, stringUtils_1.okxfromString)(multicodec, exports.MULTICODEC_ED25519_ENCODING);
    if (publicKey === undefined || publicKey.length !== exports.MULTICODEC_ED25519_LENGTH) {
        throw new Error(`Issuer must be a public key with length 32 bytes`);
    }
    return publicKey;
}
// ---------- Signature ----------------------------------------------- //
function encodeSig(bytes) {
    return (0, stringUtils_1.okxtoString)(bytes, exports.JWT_ENCODING);
}
function decodeSig(encoded) {
    return (0, stringUtils_1.okxfromString)(encoded, exports.JWT_ENCODING);
}
// ---------- Data ----------------------------------------------- //
function encodeData(params) {
    return (0, stringUtils_1.okxfromString)([encodeJSON(params.header), encodeJSON(params.payload)].join(exports.JWT_DELIMITER), exports.DATA_ENCODING);
}
function decodeData(data) {
    var _a, _b;
    const params = (0, stringUtils_1.okxtoString)(data, exports.DATA_ENCODING).split(exports.JWT_DELIMITER);
    const header = decodeJSON((_a = params[0]) !== null && _a !== void 0 ? _a : '{}');
    const payload = decodeJSON((_b = params[1]) !== null && _b !== void 0 ? _b : '{}');
    return { header, payload };
}
// ---------- JWT ----------------------------------------------- //
function encodeJWT(params) {
    return [encodeJSON(params.header), encodeJSON(params.payload), encodeSig(params.signature)].join(exports.JWT_DELIMITER);
}
function decodeJWT(jwt) {
    var _a, _b, _c;
    const params = jwt.split(exports.JWT_DELIMITER);
    const header = decodeJSON((_a = params[0]) !== null && _a !== void 0 ? _a : '{}');
    const payload = decodeJSON((_b = params[1]) !== null && _b !== void 0 ? _b : '{}');
    const signature = decodeSig((_c = params[2]) !== null && _c !== void 0 ? _c : '{}');
    const data = (0, stringUtils_1.okxfromString)(params.slice(0, 2).join(exports.JWT_DELIMITER), exports.DATA_ENCODING);
    return { header, payload, signature, data };
}
function signJWT(sub_1, aud_1, ttl_1, keyPair_1) {
    return __awaiter(this, arguments, void 0, function* (sub, aud, ttl, keyPair, iat = Math.floor(Date.now())) {
        const header = { alg: exports.JWT_IRIDIUM_ALG, typ: exports.JWT_IRIDIUM_TYP };
        const iss = encodeIss(keyPair.publicKey);
        const exp = iat + ttl;
        const act = "authenticate user";
        const payload = { iss, sub, aud, act, iat, exp };
        const data = encodeData({ header, payload });
        // const signature = ed25519.sign(keyPair.secretKey, data);
        log.logDebug(`get sec kp: ${keyPair.secretKey} {${keyPair.secretKey.length}}`);
        const signature = tweetnacl_1.default.sign.detached(data, keyPair.secretKey);
        return encodeJWT({ header, payload, signature });
    });
}
function verifyJWT(jwt) {
    return __awaiter(this, void 0, void 0, function* () {
        const { header, payload, data, signature } = decodeJWT(jwt);
        if (header.alg !== exports.JWT_IRIDIUM_ALG || header.typ !== exports.JWT_IRIDIUM_TYP) {
            throw new Error("JWT must use EdDSA algorithm");
        }
        const publicKey = decodeIss(payload.iss);
        return ed25519.verify(publicKey, data, signature);
    });
}
