import { Device, SongMetadata } from "@/player/PlayerState";

export interface PlayerControlInterface {
  toggle();
  play();
  pause();
  seekTo(time: number);
}

export interface RemotePlayerControlInterface extends PlayerControlInterface {
  nextSong();
  prevSong();
}

export type VoidCallback = () => void;
export type ProgressCallback = (currentTime: number) => void;
export type MetadataCallback = (metadata: SongMetadata) => void;
