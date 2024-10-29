import { IStore } from "../store";
import { TonProofItemReply } from "./ton";
import { Account } from "./ton/connect-wallet";
import { DappMetadata } from "./dapp-metadata";
import { EthereumRpcMap } from "srcts/protocol";
export type SessionNamespace = SessionTypes.Namespace;
export declare namespace SessionTypes {
    type Expiry = number;
    interface Namespace {
        chains: string[];
        accounts: string[];
        methods: string[];
        rpcMap?: EthereumRpcMap;
        defaultChain?: string;
        payload?: {
            tonAccount?: Account;
            tonProof?: TonProofItemReply;
        };
    }
    type Namespaces = Record<string, Namespace>;
    interface SessionConfig extends ConnectSessionConfig {
        dappInfo: DappMetadata;
    }
    interface ConnectSessionConfig {
        openUniversalUrl?: boolean;
        redirect?: string;
    }
    interface Struct {
        topic: string;
        namespaces: Namespaces;
        sessionConfig?: SessionConfig;
    }
}
export type ISession = IStore<string, SessionTypes.Struct>;
