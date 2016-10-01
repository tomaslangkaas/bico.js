# bico.js
Binary codecs for JavaScript

`bico.js` is a micro-library for generating string-to-binary encoders and decoders in JavaScript&mdash;converting between string and array representations of binary data.

```javascript
var hexString  =  'f5:f8:34 12:45:af f9cd';
var byteValues =  bico.fromHex(hexString);
//  byteValues == [0xf5, 0xf8, 0x34, 0x12, 0x45, 0xaf, 0xf9, 0xcd]

var messageString   =  'fooba';
var messageAsBase64 =  bico.toBase64(bico.fromString(messageString));
//  messageAsBase64 == 'Zm9vYmE='
```
