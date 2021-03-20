import { SongMetadata } from "@/store";

export interface PlayerInterface {
  readonly currentTime: number;
  readonly duration: number;
  toggle();
  play();
  pause();
  seekTo(time: number);
  onTimeUpdate(callback: ProgressCallback);
  onPlay(callback: ProgressCallback);
  onPlaying(callback: ProgressCallback);
  onPause(callback: ProgressCallback);
  onEnded(callback: VoidCallback);
  onReady(callback: VoidCallback);
  onLoadedMetadata(callback: MetadataCallback);
}

export type VoidCallback = () => void;
export type ProgressCallback = (currentTime: number) => void;
export type MetadataCallback = (metadata: SongMetadata) => void;
