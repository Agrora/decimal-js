import { copyInfo, createInfo, createSubInfo, DECIMAL_RADIX, DecimalInfo, DecimalSign } from './common';
import isZero from './isZero';
import removeLeadingZeroes from './removeLeadingZeroes';
import subtract from './subtract';

const { min, max, floor } = Math;

const MULTIPLY_BASE_DIGITS = 80;
const MULTIPLY_SMALL_DIGITS = 80 / 4;

export default function multiply(
    a: DecimalInfo,
    b: DecimalInfo,
    scale: number = max(a.scale, b.scale),
): DecimalInfo {
    // Initialize things.
    const aSize = a.length + a.scale;
    const bSize = b.length + b.scale;
    const fullScale = a.scale + b.scale;
    const productScale = min(scale, fullScale);
    let product = multiplyRecursive(a, aSize, b, bSize, fullScale);
    // Assign to prod and clean up the number.
    product.sign = (a.sign === b.sign ? DecimalSign.PLUS : DecimalSign.MINUS);
    product.length = bSize + aSize + 1 - fullScale;
    product.scale = productScale;
    // Make sure value fits configured size
    if (product.scale < product.value.length) {
        product.value = product.value.subarray(0, product.length + product.scale);
    }
    product = removeLeadingZeroes(product);
    if (isZero(product)) {
        product.sign = DecimalSign.PLUS;
    }
    return product;
}

// bcmath equivalent: _bc_simp_mul
export function multiplySimple(
    a: DecimalInfo,
    aLength: number,
    b: DecimalInfo,
    bLength: number,
    // @ts-ignore
    fullScale: number = 0, // Unneeded parameter??
): DecimalInfo {
    const productLength = aLength + bLength + 1;
    const product = createInfo(productLength);
    const aEnd = aLength - 1;
    const bEnd = bLength - 1;
    let productPos = productLength - 1;
    let sum = 0;
    let aPos;
    let bPos;

    for (let i = 0; i < productLength - 1; i += 1, productPos -= 1) {
        aPos = aEnd - max(0, i - bLength + 1);
        bPos = bEnd - min(i, bLength - 1);
        for (; (aPos >= 0) && (bPos <= bEnd); aPos -= 1, bPos += 1) {
            sum += a.value[aPos] * b.value[bPos];
        }
        product.value[productPos] = floor(sum % DECIMAL_RADIX);
        sum = floor(sum / DECIMAL_RADIX);
    }
    product.value[productPos] = sum;
    return product;
}

// bcmath equivalent: _bc_rec_mul
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
export function multiplyRecursive(
    a: DecimalInfo,
    aLength: number,
    b: DecimalInfo,
    bLength: number,
    fullScale: number = 0,
): DecimalInfo {
    // Base case?
    if ((aLength + bLength) < MULTIPLY_BASE_DIGITS ||
        aLength < MULTIPLY_SMALL_DIGITS ||
        bLength < MULTIPLY_SMALL_DIGITS) {
        return multiplySimple(a, aLength, b, bLength, fullScale);
    }

    // Calculate n -- the u and v split point in digits.
    const n = floor((max(aLength, bLength) + 1) / 2);

    let a0;
    let a1;
    let b0;
    let b1;
    // Split a and b
    if (aLength < n) {
        a1 = createInfo();
        a0 = createSubInfo(a, aLength, 0);
    } else {
        a1 = createSubInfo(a, aLength - n, 0);
        a0 = createSubInfo(a, n, 0, aLength - n);
    }
    if (bLength < n) {
        b1 = createInfo();
        b0 = createSubInfo(b, bLength, 0);
    } else {
        b1 = createSubInfo(b, bLength - n, 0);
        b0 = createSubInfo(b, n, 0, bLength - n);
    }
    a1 = removeLeadingZeroes(a1);
    a0 = removeLeadingZeroes(a0);
    b1 = removeLeadingZeroes(b1);
    b0 = removeLeadingZeroes(b0);

    const m1Zero = isZero(a1) || isZero(b1);

    // Calculate sub results ...
    const d1 = subtract(a1, a0);
    const d1Length = d1.length;

    const d2 = subtract(b0, b1);
    const d2Length = d2.length;

    let m1;
    let m2;
    let m3;
    // Do recursive multiplies and shifted adds.
    if (m1Zero) {
        m1 = createInfo();
    } else {
        // m1 = Libbcmath.bc_init_num(); //allow pass-by-ref
        m1 = multiplyRecursive(a1, a1.length, b1, b1.length);
    }
    if (isZero(d1) || isZero(d2)) {
        m2 = createInfo();
    } else {
        // m2 = Libbcmath.bc_init_num(); //allow pass-by-ref
        m2 = multiplyRecursive(d1, d1Length, d2, d2Length);
    }

    if (isZero(a0) || isZero(b0)) {
        m3 = createInfo();
    } else {
        // m3 = Libbcmath.bc_init_num(); //allow pass-by-ref
        m3 = multiplyRecursive(a0, a0.length, b0, b0.length);
    }

    // Initialize product
    const productLength = aLength + bLength + 1;
    let product = createInfo(productLength);
    if (!m1Zero) {
        product = shiftAddSubtract(product, m1, 2 * n);
        product = shiftAddSubtract(product, m1, n);
    }
    product = shiftAddSubtract(product, m3, n);
    product = shiftAddSubtract(product, m3, 0);
    product = shiftAddSubtract(product, m2, n, d1.sign !== d2.sign);
    return product;
}

// bcmath equivalent: _bc_shift_addsub
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
export function shiftAddSubtract(
    accumulator: DecimalInfo,
    info: DecimalInfo,
    shift: number,
    sub: boolean = false,
): DecimalInfo {
    const accum = copyInfo(accumulator);
    let count = info.length;
    if (info.value[0] === 0) {
        count -= 1;
    }

    if (accum.length + accum.scale < shift + count) {
        throw Error('len + scale < shift + count');
    }

    // Set up pointers and others
    // (signed char *)(accum->n_value + accum->n_len + accum->n_scale - shift - 1);
    let accPos = accum.length + accum.scale - shift - 1;
    let infoPos = info.length - 1; // (signed char *)(val->n_value + val->n_len - 1);
    let carry = 0;
    if (sub) {
        // Subtraction, carry is really borrow.
        for (; count >= 0; count -= 1, infoPos -= 1, accPos -= 1) {
            accum.value[accPos] -= info.value[infoPos] + carry;
            if (accum.value[accPos] < 0) {
                carry = 1;
                accum.value[accPos] += DECIMAL_RADIX;
            } else {
                carry = 0;
            }
        }
        for (; carry; accPos -= 1) {
            accum.value[accPos] -= carry;
            if (accum.value[accPos] < 0) {
                accum.value[accPos] += DECIMAL_RADIX;
            } else {
                carry = 0;
            }
        }
    } else {
        // Addition
        for (; count >= 0; count -= 1, infoPos -= 1, accPos -= 1) {
            accum.value[accPos] += info.value[infoPos] + carry;
            if (accum.value[accPos] > (DECIMAL_RADIX - 1)) {
                carry = 1;
                accum.value[accPos] -= DECIMAL_RADIX;
            } else {
                carry = 0;
            }
        }
        for (; carry; accPos -= 1) {
            accum.value[accPos] += carry;
            if (accum.value[accPos] > (DECIMAL_RADIX - 1)) { // if (*accp > (BASE-1))
                accum.value[accPos] -= DECIMAL_RADIX;
            } else {
                carry = 0;
            }
        }
    }
    return accum;
}
