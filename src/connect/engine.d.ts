import { ConnectionManager } from "./connectionManager";
import { CallForSuccessOptions } from "../utils/call-for-success";
import { ConnectResponse, RequestArguments, Response } from "../protocol";
import { RequestAnswer } from "./constants";
import { ConnectInfo } from "./constants";
import { SessionTypes } from "../protocol/connect/session";
import SessionConfig = SessionTypes.SessionConfig;
import { ConnectEngineRequest } from "../protocol/connect/connect-request";
export declare class Engine {
    private readonly pendingRequests;
    private disconnectListener;
    connectionManager: ConnectionManager;
    constructor(connectionManager: ConnectionManager);
    addDisconnectListener(disconnecter: () => void): void;
    disconnect(): void;
    getRequestId(): string;
    bindRequestForPromise(requestId: string, resolve: (value: Response) => void): void;
    send(request: RequestArguments, requestAnswer: RequestAnswer, option?: CallForSuccessOptions): Promise<void>;
    handleResponse(event: string, response: Response): void;
    restoreconnect(sessionInfo: SessionTypes.Struct, onConnectResult: (session: SessionTypes.Struct | null) => void): Promise<void>;
    conect(request: ConnectEngineRequest, sessionConfig: SessionConfig, onConnectResult: (session: SessionTypes.Struct | null, value: Response) => void): Promise<{
        connectInfo: ConnectInfo;
        deeplinkUrl: string;
    }>;
    onConnect(connectResponse: ConnectResponse, sessionConfig: SessionConfig, topic: string): SessionTypes.Struct | null;
}
