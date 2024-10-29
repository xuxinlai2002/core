import { OKX_CONNECT_ERROR_CODES } from "../../";
import { DeviceInfo } from "../device-info";
import { TONCHAIN } from "./";
export type ConnectEvent = ConnectEventSuccess | ConnectEventError;
export interface ConnectEventSuccess {
    event: 'connect';
    requestId: number;
    payload: {
        items: ConnectItemReply[];
        device: DeviceInfo;
    };
}
export interface ConnectEventError {
    event: 'connect_error';
    requestId: number;
    payload: {
        code: OKX_CONNECT_ERROR_CODES;
        message?: string;
    };
}
export type ConnectItemReply = TonAddressItemReply | TonProofItemReply;
export interface TonAddressItemReply {
    name: 'ton_addr';
    address: string;
    network: TONCHAIN;
    walletStateInit: string;
    publicKey: string;
}
export type TonProofItemReply = TonProofItemReplySuccess | TonProofItemReplyError;
export interface TonProofItemReplySuccess {
    name: 'ton_proof';
    proof: {
        timestamp: number;
        domain: {
            lengthBytes: number;
            value: string;
        };
        payload: string;
        signature: string;
    };
}
export type TonProofItemReplyError = ConnectItemReplyError<TonProofItemReplySuccess['name']>;
export declare enum CONNECT_ITEM_ERROR_CODES {
    UNKNOWN_ERROR = 0,
    METHOD_NOT_SUPPORTED = 400
}
export type ConnectItemReplyError<T> = {
    name: T;
    error: {
        code: CONNECT_ITEM_ERROR_CODES;
        message?: string;
    };
};
export type WalletEvent = ConnectEvent | DisconnectEvent;
export interface DisconnectEvent {
    event: 'disconnect';
    requestId: number;
    payload: {};
}
