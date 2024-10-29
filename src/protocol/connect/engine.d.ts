import { JsonRpcResponse, JsonRpcRequest, ErrorResponse, ConnectNamespaceMap, RequestParams } from "../index";
import { SessionTypes } from "./session";
import { ProposalTypes } from "./proposal";
import { DappMetadata } from "./";
import { Engine } from "../../connect";
import EventEmitter from "eventemitter3";
export declare namespace Verify {
    interface Context {
        verified: {
            origin: string;
            validation: "UNKNOWN" | "VALID" | "INVALID";
            verifyUrl: string;
            isScam?: boolean;
        };
    }
}
export declare namespace SignClientTypes {
    type Event = "session_proposal" | "session_update" | "session_extend" | "session_ping" | "session_delete" | "session_expire" | "session_request" | "session_request_sent" | "session_event" | "session_authenticate" | "proposal_expire" | "session_request_expire";
    interface BaseEventArgs<T = unknown> {
        id: number;
        topic: string;
        params: T;
    }
    interface EventArguments {
        session_proposal: {
            verifyContext: Verify.Context;
        } & Omit<BaseEventArgs<ProposalTypes.Struct>, "topic">;
        session_update: BaseEventArgs<{
            namespaces: SessionTypes.Namespaces;
        }>;
        session_extend: Omit<BaseEventArgs, "params">;
        session_ping: Omit<BaseEventArgs, "params">;
        session_delete: Omit<BaseEventArgs, "params">;
        session_expire: {
            topic: string;
        };
        session_request: {
            verifyContext: Verify.Context;
        } & BaseEventArgs<{
            request: {
                method: string;
                params: any;
                expiryTimestamp?: number;
            };
            chainId: string;
        }>;
        session_request_sent: {
            request: {
                method: string;
                params: any;
            };
            topic: string;
            chainId: string;
            id: number;
        };
        session_event: BaseEventArgs<{
            event: {
                name: string;
                data: any;
            };
            chainId: string;
        }>;
        session_authenticate: {
            verifyContext: Verify.Context;
        };
        proposal_expire: {
            id: number;
        };
        session_request_expire: {
            id: number;
        };
    }
    type Metadata = DappMetadata;
}
export declare namespace EngineTypes {
    type Event = "session_connect" | "session_approve" | "session_update" | "session_extend" | "session_ping" | "pairing_ping" | "session_request";
    interface EventArguments {
        session_connect: {
            error?: ErrorResponse;
            session?: SessionTypes.Struct;
        };
        session_approve: {
            error?: ErrorResponse;
        };
        session_update: {
            error?: ErrorResponse;
        };
        session_extend: {
            error?: ErrorResponse;
        };
        session_ping: {
            error?: ErrorResponse;
        };
        pairing_ping: {
            error?: ErrorResponse;
        };
        session_request: {
            error?: ErrorResponse;
            result?: any;
        };
    }
    interface UriParameters {
        protocol: string;
        version: number;
        topic: string;
        symKey: string;
        methods?: string[];
        expiryTimestamp?: number;
    }
    interface EventCallback<T extends JsonRpcRequest | JsonRpcResponse> {
        topic: string;
        payload: T;
    }
    interface ConnectParams {
        namespaces?: ConnectNamespaceMap;
        optionalNamespaces?: ConnectNamespaceMap;
        sessionConfig?: SessionTypes.ConnectSessionConfig;
    }
    interface RejectParams {
        id: number;
        reason: ErrorResponse;
    }
    interface UpdateParams {
        topic: string;
        namespaces: SessionTypes.Namespaces;
    }
    interface ExtendParams {
        topic: string;
    }
    interface RespondParams {
        topic: string;
        response: JsonRpcResponse;
    }
    interface EmitParams {
        topic: string;
        event: {
            name: string;
            data: any;
        };
        chainId: string;
    }
    interface PingParams {
        topic: string;
    }
    interface FindParams {
        requiredNamespaces: ProposalTypes.RequiredNamespaces;
    }
    type AcknowledgedPromise = Promise<{
        acknowledged: () => Promise<void>;
    }>;
    type EngineQueue<T> = {
        state: "IDLE" | "ACTIVE";
        queue: T[];
    };
}
export declare abstract class IEngineEvents extends EventEmitter {
    constructor();
    abstract emit: <E extends EngineTypes.Event>(event: string | symbol, args: EngineTypes.EventArguments[E]) => boolean;
    abstract once: <E extends EngineTypes.Event>(event: string | symbol, listener: (args: EngineTypes.EventArguments[E]) => any) => this;
}
export declare abstract class ISignClientEvents extends EventEmitter {
    constructor();
    abstract on(event: string | symbol, listener: (...args: any[]) => void): this;
    abstract on<E extends keyof SignClientTypes.EventArguments>(event: E, listener: (args: SignClientTypes.EventArguments[E]) => any): this;
    abstract once(event: string | symbol, listener: (...args: any[]) => void): this;
    abstract once<E extends keyof SignClientTypes.EventArguments>(event: E, listener: (args: SignClientTypes.EventArguments[E]) => any): this;
    abstract off(event: string | symbol, listener: (...args: any[]) => void): this;
    abstract off<E extends keyof SignClientTypes.EventArguments>(event: E, listener: (args: SignClientTypes.EventArguments[E]) => any): this;
    abstract removeListener(event: string | symbol, listener: (...args: any[]) => void): this;
    abstract removeListener<E extends keyof SignClientTypes.EventArguments>(event: E, listener: (args: SignClientTypes.EventArguments[E]) => any): this;
    abstract removeAllListeners(event: string | symbol): this;
    abstract removeAllListeners<E extends keyof SignClientTypes.EventArguments>(event: E): this;
}
export declare abstract class ISignClient {
    data: SignClientTypes.Metadata;
    abstract readonly metadata: DappMetadata;
    abstract events: ISignClientEvents;
    abstract engine: Engine;
    abstract session?: SessionTypes.Struct;
    constructor(data: SignClientTypes.Metadata);
    abstract connect: IEngine["connect"];
    abstract restoreconnect: IEngine["restoreconnect"];
    abstract reject: IEngine["reject"];
    abstract request: IEngine["request"];
    abstract disconnect: IEngine["disconnect"];
}
export declare abstract class IEngine {
    client: ISignClient;
    constructor(client: ISignClient);
    abstract init(): Promise<void>;
    abstract connect(params: EngineTypes.ConnectParams): Promise<SessionTypes.Struct | null>;
    abstract restoreconnect(params: SessionTypes.Struct): Promise<SessionTypes.Struct | null>;
    abstract reject(params: EngineTypes.RejectParams): Promise<void>;
    abstract update(params: EngineTypes.UpdateParams): EngineTypes.AcknowledgedPromise;
    abstract extend(params: EngineTypes.ExtendParams): EngineTypes.AcknowledgedPromise;
    abstract request<T>(params: RequestParams): Promise<T>;
    abstract respond(params: EngineTypes.RespondParams): Promise<void>;
    abstract emit(params: EngineTypes.EmitParams): Promise<void>;
    abstract ping(params: EngineTypes.PingParams): Promise<void>;
    abstract disconnect(): Promise<void>;
    abstract find: (params: EngineTypes.FindParams) => SessionTypes.Struct[];
}
