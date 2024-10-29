export const __esModule: boolean;
export const EVENT_EMITTER_MAX_LISTENERS: 10;
export const OKXCONNECTOR_WS_URL: "wss://wsdexpri.okx.com/ws/v1/wallet-connect-relay";
export const OKXCONNECTOR_MESSAGE_TTL: 300000;
export const CONNECT_JSONRPC_VER: "2.0";
export namespace ConnectorState {
    let InitState: number;
    let Connecting: number;
    let Connected: number;
    let Disconnected: number;
    let OnError: number;
}
