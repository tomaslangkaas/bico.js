# bico.js
Binary codecs and codec builder for JavaScript

`bico.js` is a micro-library for building string-to-binary encoders and decoders in JavaScript&mdash;converting between string and array representations of binary data.

```javascript
var hexString  =  'f5:f8:34 12:45:af f9cd';
var byteValues =  bico.fromHex(hexString);
//  byteValues == [0xf5, 0xf8, 0x34, 0x12, 0x45, 0xaf, 0xf9, 0xcd]

var messageString   =  'fooba';
var messageAsBase64 =  bico.toBase64(
                        bico.fromAscii(messageString)
                       );
//  messageAsBase64 == 'Zm9vYmE='

var bit5Values =  bico.fromHex('ABCDEF5678', 5);
//  bit5Values == [21, 15, 6, 30, 30, 21, 19, 24]
```

## Which source file to choose

### To just build encoders and decoders

`bico-base.js` contains the base functionality for building encoders and decoders, in ~0.7 kb (minified).

## To also use existing encoders and decoders

`bico.js` includes the base functionality in addition to encoders and decoders for `hex`, `ascii`, `unicode`, `base64` and `Z85` strings, in ~1.6 kb (minified).

## Basic use

### Building a codec

The following code illustrates how to build a simple (case-sensitive) `hex` codec:
```javascript
bico(bico, 'fromHex', 'toHex', '0123456789abcdef', 4);
```
This code calls `bico()`, the codec factory, and tells it 

1. to use `bico` as the codec namespace, 
2. to create an encoder (string-to-binary) named `bico.fromHex`, 
3. to create a decoder (binary-to-string) named `bico.toHex`, 
4. that the 16 characters `'012345679abcdef'` represent the values 0&ndash;15, and 
5. that 4 bits generate one character.

### Encoder (string-to-binary)

The resulting encoder, `bico.fromHex(binString[, wordSize][, flush][, outputArray])`, takes 1 to 4 arguments:

1. A `binString` to be encoded. Unknown characters are ignored (such as uppercase A&ndash;F).
2. An optional `wordSize` in bits (1&ndash;32) for the output array, defaults to `8`, if falsy.
3. A boolean value, `flush`, indicating whether bits left in the buffer should be output at the end. Defaults to `false`.
4. An optional `outputArray` to use for output.

The encoder returns array with integer values (as signed integers, convert to unsigned with `>>> 0` in consuming code, if required).

### Decoder (binary-to-string)

The resulting decoder, `bico.toHex(binArray[, wordSize][, flush])`, takes 1 to 3 arguments:

1. A `binArray` to be decoded.
2. A `wordSize` in bits (1&ndash;32) indicating the `wordSize` of `binArray`, defaults to `8`, if falsy.
3. A boolean value, `flush`, indicating whether bits left in the buffer should be output at the end. Defaults to `false`.

The decoder returns a string (as hex).

## Advanced use

### Custom encoders and custom decoders

The codec factory function, 

```javascript
bico(namespace, encoderName, decoderName, symbols,
     bitsPerWrite[, customEncoder][, customDecoder])
```

has two optional arguments, `customEncoder` and `customDecoder`. A bico encoder loops through each character in the input string, checking the charcode against a lookup table built from the `symbols` string. A `customEncoder` can override this. A `customEncoder` is a function that is called for each character in the input string, it is expected to test if the charcode is valid, if so, append bits to the bit buffer and return the number of bits appended. The `customEncoder` is always called with three arguments, the current `charcode`, the current encoder `state` array and the charcode `lookup` table. The encoder `state` is an array with three values: `[bufferAsInteger, bitsInBuffer, validCharactersRead]`. The `lookup` table is an object with valid symbol charcodes as keys, and corresponding symbol values incremented by one (to ease lookup of symbols with value `0`).

A bico decoder loops through each value in the input array and appends it to the buffer. While there are at least as many bits in the buffer as `bitsPerWrite`, this number of bits is extracted from the buffer, and the symbol corresponding to this value is appended to the output string. This could be overriden by a `customDecoder` function, which takes two arguments, a bit value of `bitsPerWrite` bits, and an array of symbol strings, where `symbols[n]` correspond to the symbol with value `n`.
 
A simple ASCII codec could look like this (simply returning the lower 8 bits of any charcode provided):

```javascript
bico(bico, 'fromAscii', 'toAscii',
  '', //empty list of symbols 
  8,
  function(charcode, state, lookup) {
    //append charcode to buffer
    state[0] = state[0] << 8 ^ charcode;
    //return number of bits appended
    return 8;
  },
  function(value, symbols) {
    return String.fromCharCode(value);
  });
```

### Wrap encoders/decoders in preprocessing or postprocessing functions

One way to make a case-insensitive `hex` encoder, is to preprocess the string (make it lower case) before encoding. The following code illustrates this, naming the case-sensitive encoder `_fromHex`, then creating a preprocessing wrapper function named `fromHex`:

```javascript
bico(bico, '_fromHex', 'toHex', '0123456789abcdef', 4);

bico.fromHex = function (binString, wordSize, flush) {
  return bico._fromHex(binString.toLowerCase(), wordSize, flush);
}
```

The `base64` decoder provided in `bico.js` uses this approach with a wrapper that forces a buffer flush when decoding, then appends the required number of padding characters to the output:

```javascript
bico(bico, 'fromBase64', '_toBase64',
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
  6);

bico['toBase64'] = function(binArr, wordSize) {
  var str = bico['_toBase64'](binArr, wordSize, true);
  return str + "==".slice((str.length + 2) % 4);
}
```
