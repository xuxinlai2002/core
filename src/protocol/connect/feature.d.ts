export type TONFeature = SendTransactionFeatureDeprecated | SignDataFeature;
export type ETHFeature = 'eth_sendTransaction';
export interface Feature {
    eip155?: string[];
    ton?: TONFeature[];
    sol?: string[];
}
export type SendTransactionFeatureDeprecated = 'ton_sendTransaction';
export type SignDataFeature = 'SignData';
