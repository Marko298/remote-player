/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  MetadataCallback,
  PlayerInterface,
  ProgressCallback,
  VoidCallback,
} from "@/player/PlayerInterface";

export class NonePlayer implements PlayerInterface {
  none() {
    console.error("None player called");
  }

  pause() {
    this.none();
  }

  play() {
    this.none();
  }

  onTimeUpdate(callback: ProgressCallback) {
    this.none();
  }

  toggle() {
    this.none();
  }

  seekTo(time: number) {
    this.none();
  }

  onEnded(callback: VoidCallback) {
    this.none();
  }

  onLoadedMetadata(callback: MetadataCallback) {
    this.none();
  }

  onPause(callback: ProgressCallback) {
    this.none();
  }

  onPlay(callback: ProgressCallback) {
    this.none();
  }

  onPlaying(callback: ProgressCallback) {
    this.none();
  }

  onReady(callback: VoidCallback) {
    this.none();
  }

  readonly currentTime: number;
  readonly duration: number;
}
