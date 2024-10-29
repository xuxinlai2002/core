"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectorState = exports.CONNECT_JSONRPC_VER = exports.OKXCONNECTOR_MESSAGE_TTL = exports.OKXCONNECTOR_WS_URL = exports.EVENT_EMITTER_MAX_LISTENERS = void 0;
exports.EVENT_EMITTER_MAX_LISTENERS = 10;
exports.OKXCONNECTOR_WS_URL = "wss://wsdexpri.okx.com/ws/v1/wallet-connect-relay";
exports.OKXCONNECTOR_MESSAGE_TTL = 300000;
// --------------- JSON RPC ---------------
exports.CONNECT_JSONRPC_VER = "2.0";
exports.ConnectorState = {
    InitState: 0,
    Connecting: 1,
    Connected: 2,
    Disconnected: 3,
    OnError: 4,
};
