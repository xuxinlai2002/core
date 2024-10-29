export const __esModule: boolean;
export function isJsonRpcPayload(payload: any): boolean;
export function isJsonRpcRequest(payload: any): boolean;
export function isJsonRpcResponse(payload: any): boolean;
export function isJsonRpcResult(payload: any): boolean;
export function isJsonRpcError(payload: any): boolean;
export function payloadId(): any;
export function getBigIntRpcId(): any;
export function formatJsonRpcRequest(method: any, params: any, id: any): {
    id: any;
    jsonrpc: string;
    method: any;
    params: any;
};
export function formatJsonRpcResult(id: any, result: any): {
    id: any;
    jsonrpc: string;
    result: any;
};
export function formatJsonRpcError(id: any, error: any, data: any): {
    id: any;
    jsonrpc: string;
    error: any;
};
export function isReservedErrorCode(code: any): boolean;
export function getError(type: any): {
    code: number;
    message: string;
};
export function getErrorByCode(code: any): any;
export function formatErrorMessage(error: any, data: any): any;
export function isHttpUrl(url: any): boolean;
export function isWsUrl(url: any): boolean;
export function parseConnectionError(e: any, url: any, type: any): any;
