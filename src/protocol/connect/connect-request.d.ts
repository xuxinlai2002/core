import { ConnectItem } from './connect-item';
import { DappMetadata } from "./";
export interface ConnectRequest {
    dappInfo: DappMetadata;
    items: ConnectItem[];
}
export type ConnectEngineUniversalRequest = {
    name: string;
    requiredNamespaces?: ConnectWalletNameSpace[];
    optionalNamespaces?: ConnectWalletNameSpace[];
};
export type ConnectWalletNameSpace = {
    namespace: string;
    chains: string[];
};
export interface BridgeConnectionRequest {
    protocolVer: number;
    topic: string;
    clientId: string;
    requestId: string;
    dAppInfo: DappMetadata;
    requests: ConnectEngineRequest;
    redirect: string;
}
export type ConnectEngineRequest = (ConnectItem | ConnectEngineUniversalRequest)[];
