Decimal JS
==========

String-based floating point arithmetic library based on PHP's [bcmath](https://www.php.net/manual/de/book.bc.php) extension.

It's essentially a port of bcmath, but written from scratch to provide a neat
and solid JavaScript/TypeScript API. Like, bcmath for JavaScript, but with a nice
API and not just a braindead C-port.

Installation
------------

```bash
npm i @agrora/decimal
```

TypeScript is supported out of the box. You don't need to install any typings.

Usage
-----

```javascript
import Decimal from '@agrora/decimal';

// Create a new decimal from a string
const decimal = Decimal.from('0.2');

// Use add() to add another decimal to it
const sum = decimal.add('0.1');

// Log the result as a string
console.log(sum.toString()); // "0.3"
```

Methods can be chained in an immutable way to perform multiple operations at once

```javascript
const decimal = Decimal.from('2');

const sum = decimal.add('5');

console.log(sum.toString()); // "7"

const result = sum
    .multiply('10')
    .multiply('2')
    .divide('5');

console.log(result.toString()); // "20"
console.log(sum.toString()); // "7" (still!)
```

Decimals can be created from strings, numbers and other decimal-ish objects!

We call all these possible values `DecimalLike` in this library.

```javascript
Decimal.from(5);

Decimal.from(2.2);

Decimal.from('18446744073709551616'); // Higher than a 64bit unsigned int!

Decimal.from('3.14159265358979323846264338327950288419716939937510582097494459230781640628620899862803482534211706798214808651328230664709384460955058223172535940812848111745028410270193852110555964462294895493038196442881097566593344612847564823378678316527...');

Decimal.from(Decimal.from(Decimal.from(Decimal.from(3))));

// If you're feeling hacky
Decimal.from({
    length: 3, 
    scale: 2, 
    sign: '-', 
    value: new Uint8Array([6, 0, 0, 2, 5])
});
``` 

API
---

#### The Decimal Class

The decimal class acts as a wrapper class around all the functions this library
exposes. This is what you want to use for the most part.

```typescript
import Decimal from '@agrora/decimal';

class Decimal {
    // Factory methods
    static from(value: DecimalLike): Decimal;
    static fromString(value: string): Decimal;
    static fromNumber(value: number): Decimal;
    static fromInfo(value: DecimalInfo): Decimal;
    
    // Basic arithmetic
    add(value: DecimalLike, scale?: number): Decimal;
    subtract(value: DecimalLike, scale?: number): Decimal;
    multiply(value: DecimalLike, scale?: number): Decimal;
    divide(value: DecimalLike, scale?: number): Decimal;
    
    // Comparisons
    compareTo(value: DecimalLike): 1|0|-1;
    isEqualTo(value: DecimalLike): boolean;
    isGreaterThan(value: DecimalLike): boolean;
    isGreaterThanOrEqualTo(value: DecimalLike): boolean;
    isLowerThan(value: DecimalLike): boolean;
    isLowerThanOrEqualTo(value: DecimalLike): boolean;
    isZero(): boolean;
    isOne(): boolean;
    isMinusOne(): boolean;
    
    negate(): Decimal;
    isNegative(): boolean;
    isPositive(): boolean;
    
    // Conversions
    toString(): string;
    toInt(): number;
    toFloat(): number;
    toFixed(scale: number): number;
}
```


### Functions

#### parseDecimal

A wrapper for `Decimal.from` to fit into other `parse<Type>` function patterns

```javascript
import { parseDecimal } from '@agrora/decimal';

const decimal = parseDecimal('0.2');
```

#### isDecimal

Checks if a value is an instance of the `Decimal` class so you can call
`add`, `subtract`, `multiply` etc. on it

```javascript
import { parseDecimal } from '@agrora/decimal';

if (isDecimal(value)) {
    console.log(value.toFixed(2));
}
```

#### isDecimalLike

Checks if a value is any valid value you could
pass to `Decimal.from()` for it to create a valid
decimal instance for it

```javascript
import { isDecimalLike, parseDecimal } from '@agrora/decimal';

if (isDecimalLike(value)) {
    const value = parseDecimal(value);
}
```

The rest of the functions are considered internal for now, but feel free
to check out the source code.

The Problem it's trying to solve
--------------------------------

JavaScript has floating point precision problems due to the way floating point
numbers are represented. In fact, this is the case for many if not most languages.

To see the problem, open a browser, press F12, go to "Console" and enter the following

    >> 0.1 + 0.2

and hit enter. You will notice it will not result in `0.3` as you might've assumed,
but rather in

    < 0.30000000000000004
    
This is a limitation of how floating point numbers can be represented binary.

Obviously this can lead to huge problems in financial and precision-critical applications.

Most languages solve this problem by having a `float/double` implementation as well
as a `decimal` implementation. While floats/doubles use the floating point processing
unit of your CPU, decimals are calculated as strings and numbers below our decimal radix (10),
like in typical school maths where you use your hands and carries you remember.

**This has two advantages:**

- Floating point numbers are calculated precisely and never loose numbers
- Numbers can be bigger than 32 or even 64 bit. In fact, they can be as long as your RAM can store

It also comes at a disadvantage, which is the reason why e.g. graphic applications, games etc. 
don't worry about precision all too much:

**It's expensive**. It costs more performance than binary floating point operations. In todays
applications, we don't need to worry about this too much. But before using this library,
try to understand the difference between a `float/double` and a `decimal` and understand when
to apply which.

If precision is neglectable (e.g. latitude/longitude, geometry, ray casting etc.), rather
use a normal number type. For currencies, weights and other precision-critical numbers
use a decimal.

Contributing
------------

Before contributing, check out the [Contribution Guidelines][contribution-guidelines]

Requires: [npm][nodejs-download]

```bash
// Pull project
git clone https://gitlab.agrora.market/OpenSource/decimal-js

// Enter project directory
cd decimal-js

// Install development dependencies
npm install

// ... make your changes ...

// Run tests
npm run test

// Lint
npm run lint

// Fix linting problems
npm run lint:fix

// Build
npm run build

// ... create branch, commit, push, merge request etc. ...
```

Future Scope
------------

- [ ] Decimal.prototype.raise(exponent: DecimalLike): Decimal
- [ ] Decimal.prototype.getSquareRoot()

Credits
-------

Credits of this library and its algorithms go to:

- tjhei ([This search result](https://github.com/tjhei/numdiff/blob/master/number.c))
- kvz ([This search result](https://raw.githubusercontent.com/kvz/locutus/master/src/php/_helpers/_bc.js))
- The original bcmath author Andy Gutmans ([Source Code Credits](https://github.com/php/php-src/blob/master/ext/bcmath/CREDITS))

Thank you for your initial work to make this library here possible.

[contribution-guidelines]: https://gitlab.agrora.market/OpenSource/decimal-js/blob/master/CONTRIBUTING.md
[nodejs-download]: https://nodejs.org/en/



