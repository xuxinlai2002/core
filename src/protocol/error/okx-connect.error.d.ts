export declare class OKXConnectError extends Error {
    private static prefix;
    code: OKX_CONNECT_ERROR_CODES;
    constructor(code: OKX_CONNECT_ERROR_CODES, message?: string);
}
export declare enum OKX_CONNECT_ERROR_CODES {
    UNKNOWN_ERROR = 0,
    BAD_REQUEST_ERROR = 1,
    ALREADY_CONNECTED_ERROR = 11,
    NOT_CONNECTED_ERROR = 12,
    UNKNOWN_APP_ERROR = 100,
    USER_REJECTS_ERROR = 300,
    METHOD_NOT_SUPPORTED = 400,
    CHAIN_NOT_SUPPORTED = 500,
    WALLET_NOT_SUPPORTED = 600
}
export declare const PARSE_ERROR = "PARSE_ERROR";
export declare const INVALID_REQUEST = "INVALID_REQUEST";
export declare const METHOD_NOT_FOUND = "METHOD_NOT_FOUND";
export declare const INVALID_PARAMS = "INVALID_PARAMS";
export declare const INTERNAL_ERROR = "INTERNAL_ERROR";
export declare const SERVER_ERROR = "SERVER_ERROR";
export declare const RESERVED_ERROR_CODES: number[];
export declare const SERVER_ERROR_CODE_RANGE: number[];
interface ISTANDARD_ERROR_MAP {
    [key: string]: {
        code: number;
        message: string;
    };
}
export declare const STANDARD_ERROR_MAP: ISTANDARD_ERROR_MAP;
export declare const DEFAULT_ERROR = "SERVER_ERROR";
export {};
