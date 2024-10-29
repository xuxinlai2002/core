export declare enum TONCHAIN {
    MAINNET = "-239"
}
export interface Account {
    /**
     * User's address in "hex" format: "<wc>:<hex>".
     */
    address: string;
    /**
     * User's selected chain.
     */
    chain: TONCHAIN;
    /**
     * Base64 (not url safe) encoded wallet contract stateInit.
     * Can be used to get user's public key from the stateInit if the wallet contract doesn't support corresponding get method.
     */
    walletStateInit: string;
    /**
     * Hex string without 0x prefix.
     */
    publicKey?: string;
}
