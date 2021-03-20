import {
  MetadataCallback,
  PlayerInterface,
  ProgressCallback,
  VoidCallback,
} from "@/player/PlayerInterface";

class RemotePlayer implements PlayerInterface {
  readonly currentTime: number;
  readonly duration: number;

  constructor() {}

  onEnded(callback: VoidCallback) {}

  onLoadedMetadata(callback: MetadataCallback) {}

  onPause(callback: ProgressCallback) {}

  onPlay(callback: ProgressCallback) {}

  onPlaying(callback: ProgressCallback) {}

  onReady(callback: VoidCallback) {}

  onTimeUpdate(callback: ProgressCallback) {}

  pause() {}

  play() {}

  seekTo(time: number) {}

  toggle() {}
}
