import { ConnectMessagePayload, ConnectPayload, ConnectPayloadReq, ConnectMessagePushPayload } from './constants';
import { EventEmitter } from "eventemitter3";
export declare class OKXWalletConnector {
    events: EventEmitter<string | symbol, any>;
    private state;
    private socket;
    private url;
    private heartbeatTimer;
    private openHandler;
    private payloadHandler;
    private failHandler;
    private listenPayloadHandler;
    constructor(url: string);
    get connecting(): boolean;
    private onPayload;
    private onClose;
    private onError;
    private onopen;
    private emitError;
    private heartbeat;
    private registOpen;
    private onVisibleChanged;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    currentStatus(): any;
    addListener(event: string, decrypt: Function, success: Function, failed: Function): void;
    addPackageParse(callback: (e: ConnectPayloadReq<ConnectMessagePayload>) => void): void;
    once(event: string, listener: any): void;
    off(event: string, listener: any): void;
    removeListener(event: string, listener: any): void;
    send(doLogin: () => Promise<void>, payload: ConnectPayload): Promise<void>;
    getMsgPayloadFromHistory(msg: ConnectMessagePushPayload): Promise<void>;
    onOpen(callback: Function): void;
}