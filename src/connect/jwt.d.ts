import * as ed25519 from "@stablelib/ed25519";
import nacl from "tweetnacl";
export interface IridiumJWTHeader {
    alg: "EdDSA";
    typ: "JWT";
}
export declare const JWTHeaderType = "dapp";
export interface IridiumJWTPayload {
    iss: string;
    sub: string;
    aud: string;
    act: string;
    iat: number;
    exp: number;
}
export interface IridiumJWTData {
    header: IridiumJWTHeader;
    payload: IridiumJWTPayload;
}
export interface IridiumJWTSigned extends IridiumJWTData {
    signature: Uint8Array;
}
export interface IridiumJWTDecoded extends IridiumJWTSigned {
    data: Uint8Array;
}
export declare const JWT_IRIDIUM_ALG: IridiumJWTHeader["alg"];
export declare const JWT_IRIDIUM_TYP: IridiumJWTHeader["typ"];
export declare const JWT_DELIMITER = ".";
export declare const JWT_ENCODING = "base64url";
export declare const JSON_ENCODING = "utf8";
export declare const DATA_ENCODING = "utf8";
export declare const KEY_PAIR_SEED_LENGTH = 32;
export declare const DID_DELIMITER = ":";
export declare const DID_PREFIX = "did";
export declare const DID_METHOD = "key";
export declare const MULTICODEC_ED25519_ENCODING = "base58btc";
export declare const MULTICODEC_ED25519_BASE = "z";
export declare const MULTICODEC_ED25519_HEADER = "K36";
export declare const MULTICODEC_ED25519_LENGTH = 32;
export declare function generateKeyPair(): nacl.SignKeyPair;
export declare function decodeJSON(str: string): any;
export declare function encodeJSON(val: any): string;
export declare function encodeIss(publicKey: Uint8Array): string;
export declare function decodeIss(issuer: string): Uint8Array;
export declare function encodeSig(bytes: Uint8Array): string;
export declare function decodeSig(encoded: string): Uint8Array;
export declare function encodeData(params: IridiumJWTData): Uint8Array;
export declare function decodeData(data: Uint8Array): IridiumJWTData;
export declare function encodeJWT(params: IridiumJWTSigned): string;
export declare function decodeJWT(jwt: string): IridiumJWTDecoded;
export declare function signJWT(sub: string, aud: string, ttl: number, keyPair: ed25519.KeyPair, iat?: number): Promise<string>;
export declare function verifyJWT(jwt: string): Promise<boolean>;
