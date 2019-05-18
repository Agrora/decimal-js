import { DecimalInfo } from './common';
export default function multiply(a: DecimalInfo, b: DecimalInfo, scale?: number): DecimalInfo;
export declare function multiplySimple(a: DecimalInfo, aLength: number, b: DecimalInfo, bLength: number, fullScale?: number): DecimalInfo;
/**
 * Recursive divide and conquer multiply algorithm.
 * based on
 * Let u = u0 + u1*(b^n)
 * Let v = v0 + v1*(b^n)
 * Then uv = (B^2n+B^n)*u1*v1 + B^n*(u1-u0)*(v0-v1) + (B^n+1)*u0*v0
 *
 * B is the base of storage, number of digits in u1,u0 close to equal.
 *
 * @param a
 * @param aLength
 * @param b
 * @param bLength
 * @param fullScale
 */
export declare function multiplyRecursive(a: DecimalInfo, aLength: number, b: DecimalInfo, bLength: number, fullScale?: number): DecimalInfo;
/**
 * A special adder/subtractor for the recursive divide and conquer
 * multiply algorithm.  Note: if sub is called, accum must
 * be larger that what is being subtracted.  Also, accum and val
 * must have n_scale = 0.  (e.g. they must look like integers.
 *
 * @param accumulator
 * @param info
 * @param shift
 * @param sub
 */
export declare function shiftAddSubtract(accumulator: DecimalInfo, info: DecimalInfo, shift: number, sub?: boolean): DecimalInfo;
