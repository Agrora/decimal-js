import add from './add';
import {
    createInfo,
    createInfoFromArray,
    createInfoFromString,
    createStringFromInfo, DECIMAL_RADIX, DecimalComparisonResult,
    DecimalInfo, DecimalLike,
    DecimalSign, isInfo,
    negate,
} from './common';
import compare from './compare';
import divide from './divide';
import isZero from './isZero';
import multiply from './multiply';
import subtract from './subtract';

export default class Decimal implements DecimalInfo {
    public static readonly ZERO = Decimal.fromInfo(createInfo());
    public static readonly ONE = Decimal.fromInfo(createInfoFromArray([1]));
    public static readonly MINUS_ONE = Decimal.fromInfo(negate(createInfoFromArray([1])));

    public readonly length: number;
    public readonly scale: number;
    public readonly value: Uint8Array;
    public readonly sign: DecimalSign;

    private constructor(length: number, scale: number, value: Uint8Array, sign: DecimalSign) {
        this.length = length;
        this.scale = scale;
        this.value = value;
        this.sign = sign;
    }

    public add(value: DecimalLike, scale?: number): Decimal {
        return Decimal.fromInfo(add(this, Decimal.from(value), scale));
    }

    public subtract(value: DecimalLike, scale?: number): Decimal {
        return Decimal.fromInfo(subtract(this, Decimal.from(value), scale));
    }

    public multiply(value: DecimalLike, scale?: number): Decimal {
        return Decimal.fromInfo(multiply(this, Decimal.from(value), scale));
    }

    public divide(value: DecimalLike, scale?: number): Decimal {
        return Decimal.fromInfo(divide(this, Decimal.from(value), scale));
    }

    public compareTo(value: DecimalLike): DecimalComparisonResult {
        return compare(this, Decimal.from(value));
    }

    public isEqualTo(value: DecimalInfo): boolean {
        return this.compareTo(value) === 0;
    }

    public isGreaterThan(value: DecimalInfo): boolean {
        return this.compareTo(value) === 1;
    }

    public isGreaterThanOrEqualTo(value: DecimalLike): boolean {
        return this.compareTo(value) >= 0;
    }

    public isLowerThan(value: DecimalInfo): boolean {
        return this.compareTo(value) === -1;
    }

    public isLowerThanOrEqualTo(value: DecimalLike): boolean {
        return this.compareTo(value) <= 0;
    }

    public isZero(): boolean {
        return isZero(this);
    }

    public isOne(): boolean {
        return this.isEqualTo(Decimal.ONE);
    }

    public isMinusOne(): boolean {
        return this.isEqualTo(Decimal.MINUS_ONE);
    }

    public negate(): Decimal {
        return Decimal.fromInfo(negate(this));
    }

    public isNegative(): boolean {
        return this.sign === DecimalSign.MINUS;
    }

    public isPositive(): boolean {
        return this.sign === DecimalSign.PLUS;
    }

    public toString(): string {
        return createStringFromInfo(this);
    }

    public toInt(): number {
        return parseInt(this.toString(), DECIMAL_RADIX);
    }

    public toFloat(): number {
        return parseFloat(this.toString());
    }

    public toFixed(scale: number): string {
        return createStringFromInfo(this, scale);
    }

    public static fromString(decimalString: string): Decimal {
        return Decimal.fromInfo(createInfoFromString(decimalString));
    }

    public static fromInfo(info: DecimalInfo): Decimal {
        return new Decimal(info.length, info.scale, info.value, info.sign);
    }

    public static fromNumber(decimalNumber: number): Decimal {
        return Decimal.fromInfo(createInfoFromString(decimalNumber.toString(DECIMAL_RADIX)));
    }

    public static from(value: DecimalLike): Decimal {
        if (value instanceof Decimal) {
            return value;
        }
        if (typeof value === 'string') {
            return Decimal.fromString(value);
        }
        if (typeof value === 'number') {
            return Decimal.fromNumber(value);
        }
        if (isInfo(value)) {
            return Decimal.fromInfo(value);
        }
        throw new Error(`Don't know how to parse value of type ${typeof value} to decimal`);
    }
}
