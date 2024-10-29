import { SupportedEncodings } from "uint8arrays/from-string";
export declare function okxfromString(string: string, encoding?: SupportedEncodings): Uint8Array;
export declare function okxtoString(array: Uint8Array, encoding?: SupportedEncodings): string;
export declare function alloc(size?: number): Uint8Array;
export declare function allocUnsafe(size?: number): Uint8Array;
