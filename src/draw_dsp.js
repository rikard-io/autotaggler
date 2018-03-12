/**
* Small utility lib for drawing raw signal buffers to canvas
* @author Rikard Lindström <rikardjh@gmail.com>
*/


export default {
  drawLabel(canvas, text, color) {
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = color || '#000';
    ctx.fillText(text, 10, 10);
  },

  drawFFT(canvas, data) {
    let context = canvas.getContext('2d'),
      windowSize = data.length * 0.5,
      w = data.length / windowSize;

    const yFac = canvas.height / windowSize;

    const maxIdx = analyze_dsp.findAbsMax(data.real);
    const countour = false;
    for (let y = 0; y < windowSize; y++) {
      const mark = false;

      const mag = Math.sqrt(data.real[y] * data.real[y] + data.imag[y] * data.imag[y]);

      const cc = mag; // mark ? 0xFFFFFF : 0xFFFFFF * mag;
      const r = (cc >> 16) & 255;
      const g = (cc >> 8) & 255;
      const b = (cc & 255);

      const c2 = 255 * mag;

      context.fillStyle = `rgba(${mag},${mag},${mag},1)`;
      context.fillRect(0, canvas.height - y * yFac, canvas.width, yFac);
    }
  },

  drawSpectrum(canvas, spectrum) {
    let ctx = canvas.getContext('2d'),
      windowSize = spectrum[0].length * 0.5;

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const yFac = canvas.height / windowSize;
    const xW = (canvas.width / spectrum.length);
    for (let x = 0; x < spectrum.length; x++) {
      for (let y = 0; y < windowSize; y++) {
        const mag = spectrum[x][y];

        const cc = mag * 10;

        const r = (cc >> 16) & 255;
        const g = (cc >> 8) & 255;
        const b = (cc & 255);

        const c2 = Math.min(255, Math.floor(mag));

        ctx.fillStyle = `rgba(${c2},${c2},${c2},1)`;
        ctx.fillRect(x * xW, y * yFac, xW * 2, yFac);
      }
    }
  },

  drawPeaks(canvas, d, peaks, color) {
    const cw = canvas.width / d.length;
    const ctx = canvas.getContext('2d');
    const h = canvas.height;
    const k = 0;

    ctx.fillStyle = color || 'rgba(255,0,0,0.2)';

    // ctx.beginPath();
    for (let i = 0; i < peaks.length; i++) {
      const s = peaks[i];
      ctx.fillRect(s * cw, 0, 2, h);

      // ctx.moveTo( s.startSamples* cw, 0);
      // ctx.lineTo( s.startSamples* cw, h );
      // ctx.moveTo( s.endSamples* cw, 0);
      // ctx.lineTo( s.endSamples* cw, h );
    }

    // ctx.stroke();
  },

  drawSilences(canvas, d, silences) {
    const cw = canvas.width / d.length;
    const ctx = canvas.getContext('2d');
    const h = canvas.height;
    const k = 0;

    ctx.strokeStyle = 'rgba(255,0,0,0.2)';

    ctx.beginPath();
    for (let i = 0; i < silences.length; i++) {
      const s = silences[i];
      ctx.rect(s.startSamples * cw, 0, s.endSamples * cw, h);
    }

    ctx.stroke();
  },

  drawEnvelope(canvas, envelope, len, color, cutout) {
    const ctx = canvas.getContext('2d');
    const h = canvas.height;
    const w = canvas.width;


    ctx.strokeStyle = color || '#AAA';
    cutout = false;
    const compositCurrent = ctx.globalCompositeOperation;
    if (cutout) {
      ctx.globalCompositeOperation = 'destination-out';
    }

    ctx.beginPath();
    ctx.moveTo(0, h);

    for (let i = 0; i < envelope.length; i++) {
      const x = (envelope[i].i / len) * w;
      const y = h - envelope[i].value * h;
      ctx.lineTo(x, y);
    }
    if (cutout) {
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(canvas.width, 0);
      ctx.lineTo(0, 0);
      ctx.fill();
    } else {
      ctx.stroke();
    }
    ctx.globalCompositeOperation = compositCurrent;
  },

  drawBuffer(canvas, d, color, mod) {
    const cw = Math.floor(d.length / canvas.width);
    const ctx = canvas.getContext('2d');
    const h = canvas.height;
    let k = 0;

    ctx.strokeStyle = color || '#AAA';


    for (let i = 0; i < d.length; i += cw) {
      const amp = analyze_dsp.avg(d, i, i + cw);
      ctx.beginPath();
      ctx.moveTo(k, h);
      if (!mod) {
        ctx.lineTo(k, (1 - amp) * h);
      } else {
        ctx.lineTo(k, 0);
        ctx.strokeStyle = `rgba(0,0,0,${amp})`;
      }
      ctx.stroke();
      k++;
    }
  },
};
