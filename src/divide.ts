import {copyInfo, createInfo, createInfoFromArray, DECIMAL_RADIX, DecimalInfo, DecimalSign} from './common';
import compare from './compare';
import isZero from './isZero';
import removeLeadingZeroes from './removeLeadingZeroes';

const { min, max, floor } = Math;

// bcmath equivalent: bc_div
export default function divide(
    a: DecimalInfo,
    b: DecimalInfo,
    scale: number = max(a.scale, b.scale),
): DecimalInfo {

    // var ptrs // return object from one_mul
    // Test for divide by zero. (return failure)
    if (isZero(b)) {
        throw Error('Division by zero');
    }

    // Test for zero divide by anything (return zero)
    if (isZero(a)) {
        return createInfo(1, scale);
    }

    if (compare(a, b) === 0) {
        return createInfoFromArray([1], 1, scale);
    }

    let qval;
    // Test for divide by 1.  If it is we must truncate.
    // @todo: check where scale > 0 too.. can't see why not
    // (ie bc_is_zero - add bc_is_one function)
    if (b.scale === 0) {
        if (b.length === 1 && b.value[0] === 1) {
            qval = createInfo(a.length, scale);
            qval.sign = (a.sign === b.sign ? DecimalSign.PLUS : DecimalSign.MINUS);
            qval.value.fill(0, a.length, a.length + scale);
            qval.value.set(a.value.subarray(a.length + min(a.scale, scale)));
            return qval;
        }
    }

    /* Set up the divide.  Move the decimal point on n1 by n2's scale.
     Remember, zeros on the end of num2 are wasted effort for dividing. */
    let scale2 = b.scale;
    let aPos = b.length + scale2 - 1;
    for (; (scale2 > 0) && (b.value[aPos] === 0); aPos -= 1) {
        scale2 -= 1;
    }

    const len1 = a.length + scale2;
    const scale1 = a.scale - scale2;
    const extra = scale1 < scale ? scale - scale1 : 0;

    const num1 = new Uint8Array(a.length + a.scale + extra + 2).fill(0);
    num1.set(a.value, 1);
    let len2 = b.length + scale2;
    const num2 = new Uint8Array(len2 + 1);
    num2.set(b.value);
    // num2[len2] = 0; // will always be 0
    aPos = 0;
    while (num2[aPos] === 0) {
        aPos += 1;
        len2 -= 1;
    }

    let zero;
    let qdigits;
    // Calculate the number of quotient digits.
    if (len2 > len1 + scale) {
        qdigits = scale + 1;
        zero = true;
    } else {
        zero = false;
        if (len2 > len1) {
            qdigits = scale + 1; // One for the zero integer part.
        } else {
            qdigits = len1 - len2 + scale + 1;
        }
    }

    // Allocate and zero the storage for the quotient.
    // qval = bc_new_num (qdigits-scale,scale);
    qval = createInfo(qdigits - scale, scale);
    const mval = new Uint8Array(len2 + 1);

    // TODO: Create a backup of b to restore later, oneMult right now modifies it
    const bBackup = copyInfo(b);

    // Now for the full divide algorithm.
    if (!zero) { // Normalize
        // norm = Libbcmath.cint(10 / (Libbcmath.cint(n2.n_value[n2ptr]) + 1));
        // norm =  10 / ((int)*n2ptr + 1)
        const norm = floor(10 / (b.value[aPos] + 1));
        if (norm !== 1) {
            oneMult(num1, 0, len1 + scale1 + extra + 1, norm, num1, 0);
            // Libbcmath._one_mult(n2ptr, len2, norm, n2ptr);
            oneMult(b.value, aPos, len2, norm, b.value, aPos);
            // TODO: b.value is modified after this call, that's why we use the bBackup workaround until it's fixed
        }

        // Initialize divide loop.
        let qdig = 0;
        let qptr = len2 > len1 ? len2 - len1 : 0;

        // Loop
        while (qdig <= len1 + scale - len2) { // Calculate the quotient digit guess.
            let qguess;
            if (b.value[aPos] === num1[qdig]) {
                qguess = 9;
            } else {
                qguess = floor((num1[qdig] * 10 + num1[qdig + 1]) / b.value[aPos]);
            }
            // Test qguess.

            if (b.value[aPos + 1] * qguess
                > (num1[qdig] * 10 + num1[qdig + 1] - b.value[aPos] * qguess) * 10 + num1[qdig + 2]) {
                qguess -= 1;
                // And again.
                if (b.value[aPos + 1] * qguess
                    > (num1[qdig] * 10 + num1[qdig + 1] - b.value[aPos] * qguess) * 10 + num1[qdig + 2]) {
                    qguess -= 1;
                }
            }

            // Multiply and subtract.
            let borrow = 0;
            if (qguess !== 0) {
                mval[0] = 0; // * mval = 0; // @CHECK is this to fix ptr2 < 0?
                // _one_mult (n2ptr, len2, qguess, mval+1); // @CHECK
                oneMult(b.value, aPos, len2, qguess, mval, 1);
                let ptr1 = qdig + len2; // (unsigned char *) num1+qdig+len2;
                let ptr2 = len2; // (unsigned char *) mval+len2;
                // @todo: CHECK: Does a negative pointer return null?
                // ptr2 can be < 0 here as ptr1 = len2, thus count < len2+1 will always fail ?
                for (let count = 0; count < len2 + 1; count += 1, ptr1 -= 1) {
                    let val;
                    if (ptr2 < 0) {
                        // val = Libbcmath.cint(num1[ptr1]) - 0 - borrow;
                        // val = (int) *ptr1 - (int) *ptr2-- - borrow;
                        val = num1[ptr1] - borrow; // val = (int) *ptr1 - (int) *ptr2-- - borrow;
                    } else {
                        // val = Libbcmath.cint(num1[ptr1]) - Libbcmath.cint(mval[ptr2--]) - borrow;
                        // val = (int) *ptr1 - (int) *ptr2-- - borrow;
                        // val = (int) *ptr1 - (int) *ptr2-- - borrow;
                        val = num1[ptr1] - mval[ptr2] - borrow;
                        ptr2 -= 1;
                    }
                    if (val < 0) {
                        val += 10;
                        borrow = 1;
                    } else {
                        borrow = 0;
                    }
                    num1[ptr1] = val;
                }
            }

            // Test for negative result.
            if (borrow === 1) {
                qguess -= 1;
                let ptr1 = qdig + len2; // (unsigned char *) num1+qdig+len2;
                let ptr2 = len2 - 1; // (unsigned char *) n2ptr+len2-1;
                let carry = 0;
                for (let count = 0; count < len2; count += 1, ptr1 -= 1) {
                    let val;
                    if (ptr2 < 0) {
                        // val = Libbcmath.cint(num1[ptr1]) + 0 + carry;
                        // val = (int) *ptr1 + (int) *ptr2-- + carry;
                        // val = (int) *ptr1 + (int) *ptr2-- + carry;
                        val = num1[ptr1] + carry;
                    } else {
                        // val = Libbcmath.cint(num1[ptr1]) + Libbcmath.cint(n2.n_value[ptr2--]) + carry;
                        // val = (int) *ptr1 + (int) *ptr2-- + carry;
                        // val = (int) *ptr1 + (int) *ptr2-- + carry;
                        val = num1[ptr1] + b.value[ptr2] + carry;
                        ptr2 -= 1;
                    }
                    if (val > 9) {
                        val -= 10;
                        carry = 1;
                    } else {
                        carry = 0;
                    }
                    num1[ptr1] = val; // * ptr1-- = val;
                }
                if (carry === 1) {
                    // num1[ptr1] = Libbcmath.cint((num1[ptr1] + 1) % 10);
                    // *ptr1 = (*ptr1 + 1) % 10; // @CHECK
                    // *ptr1 = (*ptr1 + 1) % 10; // @CHECK
                    num1[ptr1] = (num1[ptr1] + 1) % 10;
                }
            }

            // We now know the quotient digit.
            qval.value[qptr] = qguess; // * qptr++ =  qguess;
            qptr += 1;
            qdig += 1;
        }
    }

    // Clean up and return the number.
    qval.sign = (a.sign === b.sign ? DecimalSign.PLUS : DecimalSign.MINUS);
    if (isZero(qval)) {
        qval.sign = DecimalSign.PLUS;
    }
    // TODO: This is part of our bBackup prodecure above
    Object.assign(b, bBackup);
    return removeLeadingZeroes(qval);
}

/**
 * We don't export this one as I essentially don't exactly know what it's for yet.
 *
 * @param num
 * @param nPtr
 * @param size
 * @param digit
 * @param result
 * @param rPtr
 */
function oneMult(num: Uint8Array, nPtr: number, size: number, digit: number, result: Uint8Array, rPtr: number) {
    if (digit === 0) {
        result.fill(0, 0, size);
        return;
    }

    if (digit === 1) {
        result.set(num.subarray(nPtr, nPtr + size), rPtr);
        return;
    }

    let nptr = nPtr + size - 1;
    let rptr = rPtr + size - 1;
    let carry;
    let value;
    carry = 0;

    let i = size;
    for (; i > 0; i -= 1, nptr -= 1, rptr -= 1) {
        value = num[nptr] * digit + carry;
        result[rptr] = value % DECIMAL_RADIX;
        carry = floor(value / DECIMAL_RADIX);
    }

    if (carry !== 0) {
        result[rptr] = carry;
    }
}
