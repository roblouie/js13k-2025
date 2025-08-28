// Only difference between these is the Q value of the wah filter being modulated.

// THE MODULATED Q IS BETTER. It gets the mee in the meow. and the 700 value makes for a nicer mee as well.
import {audioContext} from "@/engine/audio/simplest-midi";

export function theBestDamnCatHolyShit2(audioCtx: AudioContext) {
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  const wah = audioContext.createBiquadFilter();

  // Source: sawtooth or triangle works best
  osc.type = "sawtooth";

  osc.frequency.value = 700; // 600 - 700 works
  osc.frequency.linearRampToValueAtTime(500, audioContext.currentTime + 0.7);
  osc.frequency.linearRampToValueAtTime(700, audioContext.currentTime + 0.9);

  // Amp envelope
  gain.gain.setValueAtTime(0, audioContext.currentTime);
  gain.gain.linearRampToValueAtTime(0.7, audioContext.currentTime + 0.2);
  gain.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + 0.3);
  gain.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.8);

  // Wah filter
  wah.type = "lowpass";   // can also try "bandpass"
  wah.frequency.value = 2200;
  wah.Q.value = 0; // resonance

  // Sweep the "wah"
  // wah.frequency.setValueAtTime(1500, audioCtx.currentTime);
  wah.frequency.linearRampToValueAtTime(2800, audioContext.currentTime + 0.3);
  wah.frequency.linearRampToValueAtTime(40, audioContext.currentTime + 0.8);

  wah.Q.linearRampToValueAtTime(22, audioContext.currentTime + 0.5);
  wah.Q.linearRampToValueAtTime(0, audioContext.currentTime + 0.8);


  // Connect
  osc.connect(gain);
  gain.connect(wah);
  wah.connect(audioContext.destination);

  osc.start();
  osc.stop(audioContext.currentTime + 1);
}

function theBestDamnCatHolyShit(audioCtx: AudioContext) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  const wah = audioCtx.createBiquadFilter();

  // Source: sawtooth or triangle works best
  osc.type = "sawtooth";

  osc.frequency.value = 700; // 600 - 700 works
  osc.frequency.linearRampToValueAtTime(500, audioCtx.currentTime + 0.7);
  osc.frequency.linearRampToValueAtTime(700, audioCtx.currentTime + 0.9);

  // Amp envelope
  gain.gain.setValueAtTime(0, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(0.7, audioCtx.currentTime + 0.2);
  gain.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 0.3);
  gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.8);

  // Wah filter
  wah.type = "lowpass";   // can also try "bandpass"
  wah.frequency.value = 2200;
  wah.Q.value = 0; // resonance

  // Sweep the "wah"
  // wah.frequency.setValueAtTime(1500, audioCtx.currentTime);
  wah.frequency.linearRampToValueAtTime(2800, audioCtx.currentTime + 0.3);
  wah.frequency.linearRampToValueAtTime(40, audioCtx.currentTime + 0.8);

  wah.Q.linearRampToValueAtTime(22, audioCtx.currentTime + 0.5);
  wah.Q.linearRampToValueAtTime(0, audioCtx.currentTime + 0.8);


  // Connect
  osc.connect(gain);
  gain.connect(wah);
  wah.connect(audioCtx.destination);

  osc.start();
  osc.stop(audioCtx.currentTime + 1);
}


function prettyGoodCat(audioCtx: AudioContext) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  const wah = audioCtx.createBiquadFilter();

  // Source: sawtooth or triangle works best
  osc.type = "sawtooth";

  osc.frequency.value = 620;
  // osc.frequency.setValueAtTime(700, audioCtx.currentTime);
  osc.frequency.linearRampToValueAtTime(500, audioCtx.currentTime + 0.7);
  osc.frequency.linearRampToValueAtTime(600, audioCtx.currentTime + 0.9);

  // Amp envelope
  gain.gain.setValueAtTime(0, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(0.7, audioCtx.currentTime + 0.05);
  gain.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 0.2);
  gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.8);

  // Wah filter
  wah.type = "lowpass";   // can also try "bandpass"
  wah.frequency.value = 0;
  wah.Q.value = 22; // resonance

  // Sweep the "wah"
  wah.frequency.setValueAtTime(1500, audioCtx.currentTime);
  wah.frequency.linearRampToValueAtTime(1500, audioCtx.currentTime + 0.3);
  wah.frequency.linearRampToValueAtTime(40, audioCtx.currentTime + 0.8);

  // Connect
  osc.connect(gain);
  gain.connect(wah);
  wah.connect(audioCtx.destination);

  osc.start();
  osc.stop(audioCtx.currentTime + 1);
}

function prettyGoodCat2(audioCtx: AudioContext) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  const wah = audioCtx.createBiquadFilter();

  // Source: sawtooth or triangle works best
  osc.type = "sawtooth";

  osc.frequency.value = 700; // 600 - 700 works
  // osc.frequency.setValueAtTime(700, audioCtx.currentTime);
  osc.frequency.linearRampToValueAtTime(500, audioCtx.currentTime + 0.7);
  osc.frequency.linearRampToValueAtTime(600, audioCtx.currentTime + 0.9);

  // Amp envelope
  gain.gain.setValueAtTime(0, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(0.7, audioCtx.currentTime + 0.2);
  gain.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 0.3);
  gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.8);

  // Wah filter
  wah.type = "lowpass";   // can also try "bandpass"
  wah.frequency.value = 1500;
  wah.Q.value = 3; // resonance

  // Sweep the "wah"
  // wah.frequency.setValueAtTime(1500, audioCtx.currentTime);
  wah.frequency.linearRampToValueAtTime(1500, audioCtx.currentTime + 0.3);
  wah.frequency.linearRampToValueAtTime(40, audioCtx.currentTime + 0.8);

  wah.Q.linearRampToValueAtTime(22, audioCtx.currentTime + 0.5);
  wah.Q.linearRampToValueAtTime(3, audioCtx.currentTime + 0.8);


  // Connect
  osc.connect(gain);
  gain.connect(wah);
  wah.connect(audioCtx.destination);

  osc.start();
  osc.stop(audioCtx.currentTime + 1);
}
