import { Response } from "../protocol";
export declare const EVENT_EMITTER_MAX_LISTENERS = 10;
export declare const OKXCONNECTOR_WS_URL = "wss://wsdexpri.okx.com/ws/v1/wallet-connect-relay";
export declare const OKXCONNECTOR_MESSAGE_TTL = 300000;
export declare const CONNECT_JSONRPC_VER = "2.0";
export interface ConnectLoginPayload {
    token: string;
}
export interface ConnectSubscribePayload {
    topic: string;
}
export interface ConnectMessageSendPayload {
    messageId: string;
    topic: string;
    message: string;
    ttl: number;
}
export interface ConnectMessagePushPayload {
    messageId: string;
    topic: string;
    message: string;
    publishedAt: number;
}
export interface ConnectMessagePushPayloadMessage {
    clientId: string;
    message: string;
}
export interface ConnectMessageReceivePayload {
    messageId: string;
    topic: string;
}
export interface ConnectMessageFetchPayload {
    topic: string;
}
export interface ConnectMessageFetchResultPayload {
    hasMore: boolean;
    data: Array<ConnectMessagePushPayload>;
}
export interface ConnectMessagePayload<T = any> {
    message?: ConnectMessageSendPayload;
    data?: T;
}
export interface ConnectPayloadReq<T = any> {
    id: string;
    method: string;
    jsonrpc: string;
    params: T;
}
export interface ConnectInfo {
    channelId: string;
    clientId: string;
}
export interface ConnectPayloadRsp<T = any> {
    id: string;
    jsonrpc: string;
    error?: ErrorResponse;
    result?: T;
}
export interface ErrorResponse {
    code: number;
    message: string;
}
export declare const ConnectorState: {
    InitState: number;
    Connecting: number;
    Connected: number;
    Disconnected: number;
    OnError: number;
};
export interface DeepLinkDAppInfoParam {
    url: string;
    name: string;
    iconUrl: string;
}
export interface DeepLinkDAppRequestItem {
    name: string;
    payload: any;
}
export interface DeepLinkParams {
    protocolVer: number;
    channelId: string;
    clientId: string;
    dAppInfo: DeepLinkDAppInfoParam;
    requestId: string;
    requests: any;
    redirect: string;
    testPayload?: any;
}
export type ConnectPayload<P = any, R = any> = ConnectPayloadReq<P> | ConnectPayloadRsp<R>;
export interface RequestAnswer {
    resolve?: (value: Response) => void;
    onAck?: () => void;
}
