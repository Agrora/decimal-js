import add from './add';
import {
    createInfoFromString,
    createStringFromInfo, DECIMAL_RADIX, DecimalComparisonResult,
    DecimalInfo, DecimalLike,
    DecimalSign, INFO_MINUS_ONE, INFO_ONE, INFO_ZERO, isInfo,
    negate,
} from './common';
import compare from './compare';
import divide from './divide';
import isZero from './isZero';
import max from './max';
import min from './min';
import modulo from './modulo';
import multiply from './multiply';
import raise from './raise';
import subtract from './subtract';
import divideModulo from './divideModulo';

export default class Decimal implements DecimalInfo {
    public static readonly ZERO = Decimal.fromInfo(INFO_ZERO);
    public static readonly ONE = Decimal.fromInfo(INFO_ONE);
    public static readonly MINUS_ONE = Decimal.fromInfo(INFO_MINUS_ONE);

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

    public raise(value: DecimalLike, scale?: number): Decimal {
        return Decimal.fromInfo(raise(this, Decimal.from(value), scale));
    }

    public modulo(value: DecimalLike, scale?: number): Decimal {
        return Decimal.fromInfo(modulo(this, Decimal.from(value), scale));
    }

    public divideModulo(value: DecimalLike, scale?: number): [Decimal, Decimal] {
        const [quotient, remainder] = divideModulo(this, Decimal.from(value), scale);
        return [Decimal.from(quotient), Decimal.from(remainder)];
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

    public static max(...values: DecimalLike[]): Decimal {
        return Decimal.from(max(...values.map(Decimal.from)));
    }

    public static min(...values: DecimalLike[]): Decimal {
        return Decimal.from(min(...values.map(Decimal.from)));
    }

    public static fromString(decimalString: string): Decimal {
        return Decimal.fromInfo(createInfoFromString(decimalString));
    }

    public static fromInfo(value: DecimalInfo): Decimal {
        return new Decimal(value.length, value.scale, value.value, value.sign);
    }

    public static fromNumber(value: number): Decimal {
        return Decimal.fromInfo(createInfoFromString(value.toString(DECIMAL_RADIX)));
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
        throw Error(`Don't know how to parse value of type ${typeof value} to decimal`);
    }

    public static isDecimal(value: any): value is Decimal {
        return value instanceof Decimal;
    }

    public static isDecimalLike(value: any): value is DecimalLike {
        return value instanceof Decimal || ['string', 'number'].includes(typeof value) || isInfo(value);
    }
}
