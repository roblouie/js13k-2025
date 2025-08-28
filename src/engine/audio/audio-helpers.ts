import {audioContext} from "@/engine/audio/simplest-midi";

export const softBuffer = audioContext.createBuffer(1,audioContext.sampleRate,audioContext.sampleRate);
for(let i=0;i<audioContext.sampleRate;++i){
  softBuffer.getChannelData(0)[i]=Math.random()*2-1;
}

export function envelopeMe(audioParam: AudioParam, time: number, volume: number, attack: number, decay: number, sustainLevel: number, release: number, duration: number) {
  audioParam.value = 0;
  audioParam.setValueAtTime(0, time);
  audioParam.linearRampToValueAtTime(volume, time + attack);
  audioParam.linearRampToValueAtTime(sustainLevel, time + attack + decay);
  audioParam.setValueAtTime(sustainLevel, time + duration);
  audioParam.linearRampToValueAtTime(0, time + duration + release);
  return time + duration + release;
}
