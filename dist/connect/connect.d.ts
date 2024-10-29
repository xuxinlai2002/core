export const __esModule: boolean;
export class OKXWalletConnector {
    constructor(url: any);
    events: eventemitter3_1.EventEmitter<string | symbol, any>;
    state: number;
    url: any;
    heartbeatTimer: any;
    get connecting(): boolean;
    onPayload(e: any): void;
    onClose(event: any): void;
    socket: any;
    onError(id: any, e: any): void;
    onopen(socket: any): void;
    emitError(errorEvent: any): void;
    heartbeat(): any;
    registOpen(url?: any): Promise<any>;
    onVisibleChanged(): any;
    connect(): any;
    disconnect(): any;
    currentStatus(): {
        state: number;
        url: any;
    };
    addListener(event: any, decrypt: any, success: any, failed: any): void;
    listenPayloadHandler: ((e: any) => void) | undefined;
    failHandler: ((e: any) => void) | undefined;
    addPackageParse(callback: any): void;
    payloadHandler: ((e: any) => any) | undefined;
    once(event: any, listener: any): void;
    off(event: any, listener: any): void;
    removeListener(event: any, listener: any): void;
    send(doLogin: any, payload: any): any;
    getMsgPayloadFromHistory(msg: any): any;
    onOpen(callback: any): void;
    openHandler: (() => any) | undefined;
}
import eventemitter3_1 = require("eventemitter3");
