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

## If you just want to build your own encoders and decoders

`bico-base.js` contains the base functionality for building encoders and decoders, in less than 0.7 kb (minified).

## If you want to use existing encoders and decoders

`bico.js` includes the base functionality in addition to encoders and decoders for `hex`, `ascii`, `unicode`, `base64` and `Z85` strings, in less than 1.7 kb (minified).

## Basic usage

The following code illustrates how to build a simple (case-sensitive) `hex` codec:
```javascript
bico(bico, 'fromHex', 'toHex', '0123456789abcdef', 4);
```
This code makes a call to `bico()`, a factory for creating codecs, telling it 

1. to use `bico` as namespace, 
2. create an encoder (string-to-binary) named `bico.fromHex` and 
3. a decoder (binary-to-string) named `bico.toHex`, 
4. specifying that the 16 characters `'012345679abcdef'` represent the values 0&ndash;16, and 
5. that each character represents 4 bits.
