import {
  PlayerState,
  Song,
  SongMetadata,
  StateChangeCallback,
} from "@/player/PlayerState";
import { PlayerControlInterface } from "@/player/PlayerInterface";

export class LocalPlayer implements PlayerControlInterface {
  private stateChangeCallback?: StateChangeCallback;
  private el: HTMLAudioElement;
  private song: Song;

  constructor(el: HTMLAudioElement) {
    this.el = el;
    this.subscribeToUpdates();
  }

  private _isPlaying = false;

  get isPlaying(): boolean {
    return this._isPlaying;
  }

  get isReady(): boolean {
    return this.el.readyState > 4;
  }

  get currentTime(): number {
    return this.el.currentTime;
  }

  get duration(): number {
    return this.el.duration;
  }

  get state(): PlayerState {
    return {
      duration: 0,
      currentPosition: this.currentTime,
      isPlaying: this._isPlaying,
      isReady: this.isReady,
      song: this.song,
      // songMetadata: this.metadata,
    };
  }

  get metadata(): SongMetadata | undefined | null {
    if (!this.duration) {
      return undefined;
    }

    return {
      duration: this.duration,
    };
  }

  play() {
    this.el.play();
  }

  pause() {
    this.el.pause();
  }

  setSong(song: Song) {
    this.song = song;
    this.el.src = song.url;

    if (this._isPlaying) {
      this.play();
    }

    this.updateState();
  }

  seekTo(time: number) {
    this.el.currentTime = time;
  }

  onStateChange(callback?: StateChangeCallback) {
    this.stateChangeCallback = callback;
  }

  toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  private updateState() {
    if (!this.stateChangeCallback) {
      return;
    }

    this.stateChangeCallback(this.state);
  }

  private subscribeToUpdates() {
    this.el.onplaying = () => {
      this._isPlaying = true;
      this.updateState();
    };

    this.el.onpause = () => {
      this._isPlaying = false;
      this.updateState();
    };

    this.el.onloadedmetadata = () => this.updateState();
    this.el.oncanplay = () => this.updateState();
    this.el.ontimeupdate = () => this.updateState();
  }
}
