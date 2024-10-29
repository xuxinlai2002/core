import { ConnectInfo, ErrorResponse } from './constants';
export interface ConnectionManagerInterface {
    getConnectInfo(): ConnectInfo;
    connect(fromRestore: boolean): void;
    restoreConnect(topic: string): void;
    addListener(event: any, success: Function, fail: Function): void;
    send(msg: string): void;
    sendACK(msgId: string, success: boolean, reason: ErrorResponse | undefined): void;
    cleanCache(): void;
}
