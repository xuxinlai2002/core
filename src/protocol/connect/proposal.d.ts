import { SignClientTypes } from "./engine";
import { IStore } from "../store";
export declare namespace ProposalTypes {
    interface BaseRequiredNamespace {
        chains?: string[];
        methods?: string[];
        events?: string[];
    }
    type RequiredNamespace = BaseRequiredNamespace;
    type RequiredNamespaces = Record<string, RequiredNamespace>;
    type OptionalNamespaces = Record<string, RequiredNamespace>;
    type SessionProperties = Record<string, string>;
    interface Struct {
        id: number;
        expiryTimestamp: number;
        proposer: {
            publicKey: string;
            metadata: SignClientTypes.Metadata;
        };
        sessionProperties?: SessionProperties;
        pairingTopic: string;
    }
}
export type IProposal = IStore<number, ProposalTypes.Struct>;
