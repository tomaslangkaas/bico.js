function bico(namespace, AtoB, BtoA,
  symbols, bitsPerWrite, reader, writer) {
  var lookup = [],
    i;
  for (i = 0; i < symbols.length; i++) {
    //charcode values are stored as (value + 1) to
    //allow falsy lookup to indicate no match,
    //if (value = lookup[charcode]) {value = value - 1;}
    lookup[symbols.charCodeAt(i)] = i + 1;
  }
  symbols = symbols.split('');
  reader = reader || function(charcode, state, value) {
    if (value = lookup[charcode]) {
      state[0] = state[0] << bitsPerWrite ^ (value - 1);
      return bitsPerWrite;
    }
  }
  writer = writer || function(value, symbols) {
    return symbols[value];
  }
  namespace[AtoB] = function(str, outSize, flush, output, callback) {
    output = output || [];
    outSize = outSize || 8; //defaults to 8 bits
    var state = [0, 0, 0, 0], //[buffer, bufferBits, charsRead, bitsOutput]
      pos,
      outlen, strlen = str.length,
      newBits,
      mask = (-1 >>> (32 - outSize)); // for 1-32 bit outSize
    //[bits in buffer, buffer, chars read]
    for (outlen = pos = 0; pos < strlen; pos++) {
      if (newBits = reader(str.charCodeAt(pos), state, lookup)) {
        state[2]++;
        for (state[1] += newBits, state[3] += newBits;
          state[1] >= outSize;
          state[0] &= (1 << state[1]) - 1
        ) {
          output[outlen++] = ((state[0] >>> (state[1] -= outSize)) & mask);
        }
      }
    }
    if (flush && state[1]) {
      output[outlen] = state[0] << (outSize - state[1]);
    }
    return callback ? callback(output, state) : output;
  }
  namespace[BtoA] = function(arr, inSize, flush) {
    inSize = inSize || 8; //defaults to 8 bit words
    var i, len = arr.length,
      str = '',
      buffer = 0,
      bufferSize = 0,
      mask = -1 >>> (32 - bitsPerWrite),
      offsetFactor,
      factor = Math.pow(2, inSize);
    for (i = 0; i < len; i++) {
      buffer = buffer * factor + (arr[i] >>> 0);
      for (bufferSize += inSize;
        bufferSize >= bitsPerWrite;
        bufferSize -= bitsPerWrite
      ) {
        offsetFactor = Math.pow(2, bufferSize - bitsPerWrite);
        str += writer(((buffer / offsetFactor) & mask) >>> 0, symbols);
        buffer %= offsetFactor;
      }
    }
    if (flush && bufferSize) {
      str += writer(buffer << (bitsPerWrite - bufferSize), symbols);
    }
    return str;
  }
}
