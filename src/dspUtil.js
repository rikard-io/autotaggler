export default {
  findAbsMax(arr) {
    let max = 0;
    let idx = -1;
    for (let i = 0, l = arr.length; i < l; i++) {
      const val = Math.abs(arr[i]);
      if (val > max) {
        max = val;
        idx = i;
      }
    }
    return idx;
  },

  windowArrays(a1, a2) {
    const len = a1.length;
    const hlen = Math.floor(len * 0.5);
    for (let i = 0; i < hlen; i++) {
      const r = i / hlen;
      const v1 = a1[hlen + i];
      const v2 = a2[i];

      a1[hlen + i] = v1 * (1 - r) + v2 * r;
      a2[i] = v1 * (1 - r) + v2 * r;
    }
  },
  normalize(arr) {
    const max = this.findAbsMax(arr);
    const gain = 1 - max;
    return arr.map(v => v * gain);
  },
  resample(arr, targetLen) {
    if (arr.length === targetLen) return arr;
    if (arr.length > targetLen) return this.downSample(arr, targetLen);
    if (arr.length < targetLen) return this.updsample(arr, targetLen);
  },
  downSample(arr, targetLen) {
    const ratio = targetLen / arr.length;
    // ratio = ratio || ( 1 / 100000 );

    // Programmatically determine the number of samples-per-bin used for downsampling
    const downsample = Math.ceil(arr.length * ratio /* we only want 100k bins, to keep things fast */);

    // Track the maximum value we've encountered, so that we can normalize the downsampled data
    let max = Number.MIN_VALUE;

    // Create an output buffer to hold the downsampled audio data
    const buf = new Float32Array(arr.length / downsample);

    // Iterate through the bins in the output buffer to create the downsampled result
    for (var bin = 0, len1 = buf.length; bin < len1; ++bin) {
      // Aggregate all of the samples in all of the channels, which belong in this bucket
      let avg = 0.0;


      // Aggregate all of the samples that belongs in this bin
      for (let idx = bin * downsample, len2 = idx + downsample; idx < len2; ++idx) {
        avg += arr[idx];
      }

      // Find the overall average amplitude using the aggregated sum of amplitudes in the bin
      buf[bin] = (avg / downsample);

      // Update the maximum value seen in the downsampled-output buffer
      max = Math.max(max, Math.abs(buf[bin]));
    }

    // Normalize the output buffer using the maximum value that we saw
    for (bin = 0; bin < len1; ++bin) {
      buf[bin] = buf[bin] / max;
    }

    return buf;
  },
  lerp(a, b, t) {
    return a + (b - a) * t;
  },
  updsample(arr, targetLen) {
    const buf = new Float32Array(targetLen);
    const stepLen = arr.length / targetLen;
    let jf = 0;
    for (let i = 0; i < targetLen; i++) {
      const j1 = Math.floor(jf);
      const j2 = Math.min(arr.length, j1 + 1);
      const t = jf - j1;
      const v = this.lerp(arr[j1], arr[j2], t);
      buf[i] = v;
      jf += stepLen;
    }
    return buf;
  },

};
