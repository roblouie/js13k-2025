import {audioContext} from "@/engine/audio/simplest-midi";
import {envelopeMe, softBuffer} from "@/engine/audio/audio-helpers";

export function jumpSound(isLanding?: boolean) {
  const noise = audioContext.createBufferSource();
  noise.buffer = softBuffer;
  noise.loop = true;


  const noiseFilter = audioContext.createBiquadFilter();
  noiseFilter.type = isLanding ? "lowpass" : "bandpass";
  noiseFilter.frequency.value = 100;
  noiseFilter.gain.value = 0;

  noise.connect(noiseFilter);


  const gain = audioContext.createGain();
  const stopTime = envelopeMe(gain.gain, audioContext.currentTime, 0.4, 0.05, 0.01, 0.05, 0.03, 0.1)

  noiseFilter.connect(gain);
  gain.connect(audioContext.destination);

  noise.start();
  noise.stop(stopTime);
}