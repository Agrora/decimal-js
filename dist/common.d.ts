export declare const DECIMAL_VALIDATION_REGEX: RegExp;
export declare const DECIMAL_RADIX = 10;
export declare enum DecimalSign {
    PLUS = "+",
    MINUS = "-"
}
export interface DecimalInfo {
    sign: DecimalSign;
    value: Uint8Array;
    length: number;
    scale: number;
}
export declare type DecimalComparisonResult = 1 | 0 | -1;
export declare type DecimalLike = string | number | DecimalInfo;
export declare function createInfo(length?: number, scale?: number): DecimalInfo;
export declare function createInfoFromArray(value: ArrayLike<number>, length?: number, scale?: number, offset?: number): DecimalInfo;
export declare function createInfoFromString(value: string): DecimalInfo;
export declare function createStringFromInfo(info: DecimalInfo, scale?: number): string;
export declare function createSubInfo(info: DecimalInfo, length?: number, scale?: number, offset?: number, targetOffset?: number): DecimalInfo;
export declare function copyInfo(info: DecimalInfo): DecimalInfo;
export declare function isInfo(value: any): value is DecimalInfo;
export declare function negate(info: DecimalInfo): DecimalInfo;
