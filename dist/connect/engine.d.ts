export const __esModule: boolean;
export class Engine {
    constructor(connectionManager: any);
    pendingRequests: Map<any, any>;
    disconnectListener: any[];
    connectionManager: any;
    addDisconnectListener(disconnecter: any): void;
    disconnect(): void;
    getRequestId(): string;
    bindRequestForPromise(requestId: any, resolve: any): void;
    send(request: any, requestAnswer: any, option: any): any;
    handleResponse(event: any, response: any): void;
    restoreconnect(sessionInfo: any, onConnectResult: any): any;
    conect(request: any, sessionConfig: any, onConnectResult: any): any;
    onConnect(connectResponse: any, sessionConfig: any, topic: any): {
        topic: any;
        sessionConfig: any;
        namespaces: protocol_1.SessionTypes.Namespaces;
    } | null;
}
import protocol_1 = require("../protocol");
