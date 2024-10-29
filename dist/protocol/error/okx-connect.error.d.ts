export const __esModule: boolean;
export const OKX_CONNECT_ERROR_CODES: {};
export const PARSE_ERROR: "PARSE_ERROR";
export const INVALID_REQUEST: "INVALID_REQUEST";
export const METHOD_NOT_FOUND: "METHOD_NOT_FOUND";
export const INVALID_PARAMS: "INVALID_PARAMS";
export const INTERNAL_ERROR: "INTERNAL_ERROR";
export const SERVER_ERROR: "SERVER_ERROR";
export const RESERVED_ERROR_CODES: number[];
export const SERVER_ERROR_CODE_RANGE: number[];
export namespace STANDARD_ERROR_MAP {
    namespace PARSE_ERROR {
        let code: number;
        let message: string;
    }
    namespace INVALID_REQUEST {
        let code_1: number;
        export { code_1 as code };
        let message_1: string;
        export { message_1 as message };
    }
    namespace METHOD_NOT_FOUND {
        let code_2: number;
        export { code_2 as code };
        let message_2: string;
        export { message_2 as message };
    }
    namespace INVALID_PARAMS {
        let code_3: number;
        export { code_3 as code };
        let message_3: string;
        export { message_3 as message };
    }
    namespace INTERNAL_ERROR {
        let code_4: number;
        export { code_4 as code };
        let message_4: string;
        export { message_4 as message };
    }
    namespace SERVER_ERROR {
        let code_5: number;
        export { code_5 as code };
        let message_5: string;
        export { message_5 as message };
    }
}
export class OKXConnectError extends Error {
    constructor(code: any, message: any);
    code: any;
}
export namespace OKXConnectError {
    let prefix: string;
}
export { SERVER_ERROR as DEFAULT_ERROR };
