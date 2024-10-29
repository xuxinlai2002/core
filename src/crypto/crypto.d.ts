import nacl, { BoxKeyPair } from 'tweetnacl';
export interface SessionCryptoKeyPair {
    publicKey: string;
    secretKey: string;
}
export declare class SessionCrypto {
    private nonceLength;
    private sessionKeyPair;
    constructor(keyPair?: SessionCryptoKeyPair | undefined);
    createKeypair(): nacl.BoxKeyPair;
    createKeypairFromString(keyPair: SessionCryptoKeyPair): {
        publicKey: Uint8Array;
        secretKey: Uint8Array;
    };
    createNonce(): Uint8Array;
    get keyPair(): BoxKeyPair;
    encrypt(message: string, receiverPublicKey: string): string;
    decrypt(message: string, senderPublicKey: string): string;
    stringifyKeypair(): {
        publicKey: string;
        secretKey: string;
    };
}
