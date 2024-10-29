import { RequestMetadata, SessionNamespace } from './connect';
export interface ResponseSuccess {
    requestId: string;
    method: string;
    result?: unknown[] | Record<string, unknown> | object | undefined | string;
    payload?: unknown[] | Record<string, unknown> | object | undefined;
}
export interface ResponseError {
    requestId: string;
    method: string;
    error?: {
        code: number;
        message: string;
    } | undefined;
    payload?: unknown[] | Record<string, unknown> | object | undefined;
}
export type Response = ResponseSuccess | ResponseError;
export interface UniversalProviderOpts {
    dappMetaData: RequestMetadata;
}
export interface EthereumRpcMap {
    [chainId: string]: string;
}
export interface ConnectNamespaceMap {
    [namespace: string]: ConnectNamespace;
}
export interface ConnectNamespace {
    chains: string[];
    rpcMap?: EthereumRpcMap;
    defaultChain?: string;
}
export type NamespaceConfig = {
    [namespace: string]: ConnectNamespace;
};
export interface SubProviderOpts {
    namespace: SessionNamespace;
}
export interface RequestParams extends RequestArguments {
    chainId: string;
}
export interface RequestArguments {
    method: string;
    params?: unknown[] | Record<string, unknown> | object | undefined;
}
export interface PairingsCleanupOpts {
    deletePairings?: boolean;
}
export interface ProviderRpcError extends Error {
    message: string;
    code: number;
    data?: unknown;
}
export interface ProviderMessage {
    type: string;
    data: unknown;
}
export interface ProviderInfo {
    chainId: string;
}
export declare const NameSpaceKeyEip155 = "eip155";
export declare const NameSpaceKeySOL = "solana";
export declare const NameSpaceKeyTON = "ton";
export declare const NameSpaceKeySui = "sui";
