import {
  MetadataCallback,
  PlayerInterface,
  ProgressCallback,
  VoidCallback,
} from "@/player/PlayerInterface";

export class HtmlPlayer implements PlayerInterface {
  private pauseCallback: VoidCallback;
  private endCallback: VoidCallback;

  constructor(private el: HTMLAudioElement) {}

  get currentTime() {
    return this.el.currentTime;
  }

  get duration() {
    return this.el.duration;
  }

  play() {
    this.el.play();
  }

  seekTo(time: number) {
    this.el.currentTime = time;
  }

  pause() {
    this.el.pause();
  }

  onTimeUpdate(callback: ProgressCallback) {
    this.el.ontimeupdate = () => callback(this.currentTime);
  }

  onPlay(callback: ProgressCallback) {
    this.el.onplay = () => callback(this.currentTime);
  }

  onPlaying(callback: ProgressCallback) {
    this.el.onplaying = () => callback(this.currentTime);
  }

  onPause(callback: ProgressCallback) {
    this.pauseCallback = () => callback(this.currentTime);

    this.el.onpause = () => {
      if (this.currentTime === this.duration) {
        this.endCallback();
      } else {
        this.pauseCallback();
      }
    };
  }

  onEnded(callback: VoidCallback) {
    this.endCallback = callback;
  }

  onReady(callback: VoidCallback) {
    this.el.oncanplay = callback;
  }

  onLoadedMetadata(callback: MetadataCallback) {
    this.el.onloadedmetadata = () => {
      callback({
        duration: this.duration,
      });
    };
  }

  toggle() {
    if (this.el.paused) {
      this.play();
    } else {
      this.pause();
    }
  }
}
