"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionCrypto = void 0;
const tweetnacl_1 = __importDefault(require("tweetnacl"));
const utils_1 = require("../utils/utils");
class SessionCrypto {
    constructor(keyPair = undefined) {
        this.nonceLength = 24;
        this.sessionKeyPair = keyPair ? this.createKeypairFromString(keyPair) : this.createKeypair();
    }
    createKeypair() {
        return tweetnacl_1.default.box.keyPair();
    }
    createKeypairFromString(keyPair) {
        return {
            publicKey: (0, utils_1.hexToByteArray)(keyPair.publicKey),
            secretKey: (0, utils_1.hexToByteArray)(keyPair.secretKey),
        };
    }
    createNonce() {
        return tweetnacl_1.default.randomBytes(this.nonceLength);
    }
    get keyPair() {
        return this.sessionKeyPair;
    }
    encrypt(message, receiverPublicKey) {
        const encodedMessage = new TextEncoder().encode(message);
        const nonce = this.createNonce();
        const encrypted = tweetnacl_1.default.box(encodedMessage, nonce, (0, utils_1.hexToByteArray)(receiverPublicKey), this.keyPair.secretKey);
        var hexResult = (0, utils_1.toHexString)((0, utils_1.concatUint8Arrays)(nonce, encrypted));
        var encodedResult = new TextEncoder().encode(hexResult);
        return (0, utils_1.base64encode)(encodedResult, false);
    }
    decrypt(message, senderPublicKey) {
        let base64Content = (0, utils_1.base64decode)(message, true);
        let messageByteArray = base64Content.toUint8Array();
        const [nonce, internalMessage] = (0, utils_1.splitToUint8Arrays)(messageByteArray, this.nonceLength);
        const decrypted = tweetnacl_1.default.box.open(internalMessage, nonce, (0, utils_1.hexToByteArray)(senderPublicKey), this.keyPair.secretKey);
        if (!decrypted) {
            throw new Error(`Decryption error: \n message: ${message.toString()} \n sender pubkey: ${senderPublicKey.toString()} \n keypair pubkey: ${this.keyPair.publicKey.toString()} \n keypair secretkey: ${this.keyPair.secretKey.toString()}`);
        }
        return new TextDecoder().decode(decrypted);
    }
    stringifyKeypair() {
        return {
            publicKey: (0, utils_1.toHexString)(this.keyPair.publicKey),
            secretKey: (0, utils_1.toHexString)(this.keyPair.secretKey)
        };
    }
}
exports.SessionCrypto = SessionCrypto;
