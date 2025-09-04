import {audioContext} from "@/engine/audio/simplest-midi";

export const softBuffer = audioContext.createBuffer(1,audioContext.sampleRate,audioContext.sampleRate);
for(let i=0;i<audioContext.sampleRate;++i){
  softBuffer.getChannelData(0)[i]=Math.random()*2-1;
}

export function envelopeMe(attack: number, decay: number, sustainLevel: number, release: number, volume: number, startTime: number, duration: number, audioParam: AudioParam) {
  audioParam.setValueAtTime(0, startTime);
  audioParam.linearRampToValueAtTime(volume, startTime + attack);
  audioParam.linearRampToValueAtTime(sustainLevel, startTime + attack + decay);
  audioParam.setValueAtTime(sustainLevel, startTime + duration);
  audioParam.linearRampToValueAtTime(0, startTime + duration + release);
  return startTime + duration + release;
}

export function frequencyFromMidiNote(midiNote: number) {
  return 440*2**((midiNote-69)/12);
}

const musicAsEighthNotes = [
  // First Bar
  [75, 1], [0, 1], [75, 1], [0, 1],
  [80, 2], [82, 1], [0, 1],
  [84, 3], [82, 1],
  [84, 2], [82, 1], [0, 1],

  // Second Bar
  [84, 2], [0, 2],
  [86, 1], [84, 1], [82, 1], [80, 1],
  [79, 2], [0, 1], [80, 1],
  [82, 2], [87, 2],

  // Third Bar
  [0, 3], [75, 1],
  [79, 2], [82, 1], [0, 1],
  [84, 3], [82, 1],
  [84, 2], [86, 1], [0, 1],

  // Fourth Bar
  [87, 1], [0, 3],
  [86, 1], [0, 3],
  [84, 2], [82, 5], [0, 1], // 3rd and 4th sections on one line due to long note

  // Fifth Bar
  [0, 2], [75, 2],
  [79, 2], [82, 1], [0, 1],
  [84, 3], [82, 1], // copy paste of bar 1 - 3
  [84, 2], [82, 1], [0, 1], // copy paste of bar 1 - 2

  // Sixth Bar - Full copy paste of bar 2
  [84, 2], [0, 2],
  [86, 1], [84, 1], [82, 1], [80, 1],
  [79, 2], [0, 1], [80, 1],
  [82, 2], [87, 2],

  // Seventh bar
  [0, 2], [75, 2],
  [79, 2], [82, 2],
  [84, 3], [82, 1],
  [84, 1], [0, 1], [86, 1], [0, 1],

  // Eighth Bar
  [87, 2], [0, 2],
  [86, 2], [0, 2],
  [87, 4],
  [0, 4],
];

function playSong() {
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  osc.connect(gain).connect(audioContext.destination);
  const playbackSpeed = 16;

  let startTime = 0;
  musicAsEighthNotes.forEach(note => {
    const osc = audioContext.createOscillator();
    osc.connect(gain).connect(audioContext.destination);

    osc.frequency.setValueAtTime(frequencyFromMidiNote(note[0]), startTime += note[1] / playbackSpeed);

  });

  osc.start();
}