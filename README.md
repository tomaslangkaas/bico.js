# bico.js
Binary codecs and codec builder for JavaScript

`bico.js` is a micro-library for building string-to-binary encoders and decoders in JavaScript&mdash;converting between string and array representations of binary data.

```javascript
var hexString  =  'f5:f8:34 12:45:af f9cd';
var byteValues =  bico.fromHex(hexString);
//  byteValues == [0xf5, 0xf8, 0x34, 0x12, 0x45, 0xaf, 0xf9, 0xcd]

var messageString   =  'fooba';
var messageAsBase64 =  bico.toBase64(bico.fromString(messageString));
//  messageAsBase64 == 'Zm9vYmE='
```

## Build encoders and decoders

`bico-base.js` contains the base functionality for building encoders and decoders, in ~0.6 kb (minified).

## Use existing encoders and decoders

`bico.js` includes the base functionality in addition to encoders and decoders for `hex`, `ascii`, `unicode`, `base64` and `Z85` strings, in ~1.6 kb (minified).

## Basic usage

### Building a codec

The following code illustrates how to build a simple (case-sensitive) `hex` codec:
```javascript
bico(bico, 'fromHex', 'toHex', '0123456789abcdef', 4);
```
This code calls `bico()`, the factory for creating codecs, tells it 

1. to use `bico` as the codec namespace, 
2. to create an encoder (string-to-binary) named `bico.fromHex`, 
3. to create a decoder (binary-to-string) named `bico.toHex`, 
4. that the 16 characters `'012345679abcdef'` represent the values 0&ndash;16, and 
5. that each character represents 4 bits.

### Encoder (string-to-binary)

The resulting encoder, `bico.fromHex(hexString[, wordSize][, flush][, outputArray])`, takes 1 to 4 arguments:

1. A `hexString` to be encoded. Unknown characters are ignored (such as uppercase A&ndash;F).
2. An optional `wordSize` (1&ndash;32 bits) for the output array, defaults to `8`, if falsy.
3. A boolean value, `flush` indicating whether bits left in the buffer should be output at the end. Defaults to `false`.
4. An optional `outputArray` to use for output.

The encoder returns array with integer values (as signed integers, convert to unsigned with `>>> 0` in consuming code, if required).

### Decoder (binary-to-string)

The resulting decoder, `bico.toHex(binArray[, wordSize][, flush])`, takes 1 to 3 arguments:

1. A `binArray` to be decoded.
2. A `wordSize` (1&ndash;32 bits) indicating the `wordSize` of `binArray`, defaults to `8`, if falsy.
3. A boolean value, `flush` indicating whether bits left in the buffer should be output at the end. Defaults to `false`.

The decoder returns a `hex` string.
