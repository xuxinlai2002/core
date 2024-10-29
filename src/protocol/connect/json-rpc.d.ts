export interface JsonRpcProviderMessage<T = any> {
    type: string;
    data: T;
}
export interface RequestArguments<T = any> {
    method: string;
    params?: T;
    id?: number;
}
export interface JsonRpcRequest<T = any> extends Required<RequestArguments<T>> {
    id: number;
    jsonrpc: string;
}
export interface JsonRpcResult<T = any> {
    id: number;
    jsonrpc: string;
    result: T;
}
export interface JsonRpcError {
    id: number;
    jsonrpc: string;
    error: ErrorResponse;
}
export interface ErrorResponse {
    code: number;
    message: string;
    data?: string;
}
export type JsonRpcResponse<T = any> = JsonRpcResult<T> | JsonRpcError;
export type JsonRpcPayload<P = any, R = any> = JsonRpcRequest<P> | JsonRpcResponse<R>;
export declare function isJsonRpcPayload(payload: any): payload is JsonRpcPayload;
export declare function isJsonRpcRequest<T = any>(payload: JsonRpcPayload): payload is JsonRpcRequest<T>;
export declare function isJsonRpcResponse<T = any>(payload: JsonRpcPayload): payload is JsonRpcResponse<T>;
export declare function isJsonRpcResult<T = any>(payload: JsonRpcPayload): payload is JsonRpcResult<T>;
export declare function isJsonRpcError(payload: JsonRpcPayload): payload is JsonRpcError;
export declare function payloadId(): number;
export declare function getBigIntRpcId(): bigint;
export declare function formatJsonRpcRequest<T = any>(method: string, params: T, id?: number): JsonRpcRequest<T>;
export declare function formatJsonRpcResult<T = any>(id: number, result: T): JsonRpcResult<T>;
export declare function formatJsonRpcError(id: number, error?: string | ErrorResponse, data?: string): JsonRpcError;
export declare function isReservedErrorCode(code: number): boolean;
export declare function getError(type: string): ErrorResponse;
export declare function getErrorByCode(code: number): ErrorResponse;
export declare function formatErrorMessage(error?: string | ErrorResponse, data?: string): ErrorResponse;
export declare function isHttpUrl(url: string): boolean;
export declare function isWsUrl(url: string): boolean;
export declare function parseConnectionError(e: Error, url: string, type: string): Error;
