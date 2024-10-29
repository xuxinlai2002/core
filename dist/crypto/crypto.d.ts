export const __esModule: boolean;
export class SessionCrypto {
    constructor(keyPair?: undefined);
    nonceLength: number;
    sessionKeyPair: any;
    createKeypair(): any;
    createKeypairFromString(keyPair: any): {
        publicKey: Uint8Array;
        secretKey: Uint8Array;
    };
    createNonce(): any;
    get keyPair(): any;
    encrypt(message: any, receiverPublicKey: any): string;
    decrypt(message: any, senderPublicKey: any): string;
    stringifyKeypair(): {
        publicKey: string;
        secretKey: string;
    };
}
