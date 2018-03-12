import { KNNImageClassifier } from 'deeplearn-knn-image-classifier';
import * as dl from 'deeplearn';
import { ComplexArray } from 'jsfft';
import dspUtil from './dspUtil';
import drawDsp from './draw_dsp';

const ft = require('fourier-transform');

const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function drawFFT(data, size = 227) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  canvas.width = size;
  canvas.height = size;

  drawDsp.drawSpectrum(canvas, data);
  // document.body.appendChild(canvas);
  return context.getImageData(0, 0, size, size);
}

function createPixel(ctx, r, g, b, a) {
  const pixel = ctx.createImageData(1, 1); // only do this once per page
  const d = pixel.data; // only do this once per page
  d[0] = r;
  d[1] = g;
  d[2] = b;
  d[3] = a;
  return pixel;
}

function toFFT(buffer, chunkSize, len) {
  if (buffer) {
    let chanData = buffer.getChannelData(0);

    // chanData = dspUtil.resample(chanData, len);
    chanData = dspUtil.normalize(chanData);
    const numChunks = Math.floor(chanData.length / chunkSize);
    const chunks = [];

    // var chanDataWindowed = [];
    // var windowSize = chunkSize / 2;

    // @TODO, windowing?

    for (let i = 0; i < numChunks; i++) {
      let chunkMag = 0;

      // const chunkData = new Float32Array(chunkSize);
      // for (let j = 0; j < chunkSize; j++) {
      //   const r = i * chunkSize + j;
      //   if (r < chanData.length) {
      //     chunkData[j] = chanData[r];
      //   }
      // }
      // const fft = ft(chunkData);// new ComplexArray(chunkSize);
      const a = new ComplexArray(chunkSize);
      for (let j = 0; j < chunkSize; j++) {
        const r = i * chunkSize + j;
        if (r < chanData.length) {
          a.real[j] = chanData[r];
          chunkMag += Math.abs(chanData[r]);
        }
      }

      const fft = a.FFT();
      fft.__magnitude = chunkMag;
      fft.__amp = chunkMag / chunkSize;
      chunks.push(fft.magnitude());
    }


    return chunks;
  }
  throw new Error('Clip has no buffer!');
}


export default {

  setup(numClasses, topK = 10) {
    this.knn = new KNNImageClassifier(numClasses, topK);
    return this.knn.load(); // promise
  },

  audioFileToFFT(audioFile) {
    return new Promise(((res, rej) => {
      const fileReader = new FileReader();
      let arrayBuffer;

      fileReader.onloadend = () => {
        arrayBuffer = fileReader.result;
        res(arrayBuffer);
      };
      fileReader.readAsArrayBuffer(audioFile);
    })).then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer).then((buffer) => {
      const fft = toFFT(buffer, 256, 44100);
      return fft;
    }));
  },

  process(audioFile, classIndex) {
    return this.audioFileToFFT(audioFile).then((fft) => {
      const imageData = drawFFT(fft);
      const image = dl.fromPixels(imageData);

      this.knn.addImage(image, classIndex);
    });
  },

  predict(audioFile) {
    return this.audioFileToFFT(audioFile).then((fft) => {
      const image = dl.fromPixels(drawFFT(fft));
      return this.knn.predictClass(image).then((res) => {
        image.dispose();
        return res.classIndex;
      });
    });
  },
};
