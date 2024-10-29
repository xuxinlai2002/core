import { ResponseError, ResponseSuccess } from "../misc";
import { OKX_CONNECT_ERROR_CODES } from "../index";
import { DeviceALlInfo } from "./device-info";
import { ConnectItemReply } from "./ton";
export type ConnectResponse = ConnectResponseSuccess | ConnectResponseError;
export interface ConnectResponseSuccess extends ResponseSuccess {
    requestId: string;
    method: 'connect';
    payload: {
        responses: (ConnectItemReply | UniversalResponse)[];
        wallet: DeviceALlInfo;
    };
}
export interface ConnectResponseError extends ResponseError {
    requestId: string;
    method: 'connect_error';
    payload: {
        code: OKX_CONNECT_ERROR_CODES;
        message?: string;
    };
}
export type UniversalResponse = {
    name: "requestAccounts";
    accounts: {
        namespace: string;
        addresses: string[];
        methods: string[];
    }[];
};
