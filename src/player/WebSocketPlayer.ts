import {
  DeviceChangedCallback,
  MetadataCallback,
  ProgressCallback,
  RemotePlayerInterface,
  VoidCallback,
} from "@/player/PlayerInterface";
import { Socket } from "socket.io-client";
import { Device } from "@/store";
import { myId } from "@/id";

export interface SocketManager {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subscribe(eventName: string, handler: (...args: any[]) => void): void;

  unsubscribe(eventName: string): void;
}

export class WebSocketPlayer implements RemotePlayerInterface {
  constructor(private socket: Socket, private manager: SocketManager) {
    this.manager.subscribe("registered", (devices: Device[]) => {
      this._devices = devices;
    });

    this.manager.subscribe("devicesUpdated", (devices: Device[]) => {
      this._devices = devices;
    });

    this.socket.emit("announce", myId);
  }

  private _currentTime: number;

  get currentTime() {
    return this._currentTime;
  }

  private _duration: number;

  get duration() {
    return this._duration;
  }

  private _devices: Device[] = [];

  get devices() {
    return this._devices;
  }

  onEnded(callback: VoidCallback) {
    this.manager.subscribe("ended", callback);
  }

  onLoadedMetadata(callback: MetadataCallback) {
    this.manager.subscribe("loadedMetadata", (metadata) => {
      this._duration = metadata.duration;
      callback(metadata);
    });
  }

  onPause(callback: ProgressCallback) {
    this.manager.subscribe("pause", ({ time }) => callback(time));
  }

  onPlay(callback: ProgressCallback) {
    this.manager.subscribe("play", ({ time }) => callback(time));
  }

  onPlaying(callback: ProgressCallback) {
    this.manager.subscribe("playing", ({ time }) => callback(time));
  }

  onReady(callback: VoidCallback) {
    this.manager.subscribe("ready", callback);
  }

  onTimeUpdate(callback: ProgressCallback) {
    this.manager.subscribe("timeUpdate", ({ time }) => {
      this._currentTime = time;
      callback(time);
    });
  }

  pause() {
    this.socket.emit("pause", { time: this.currentTime });
  }

  play() {
    this.socket.emit("play", { time: this.currentTime });
  }

  toggle() {
    this.socket.emit("toggle", { time: this.currentTime });
  }

  seekTo(time: number) {
    this.socket.emit("pause", { time });
  }

  onDevicesChanged(callback: DeviceChangedCallback) {
    this.manager.subscribe("devicesUpdated", (devices: Device[]) => {
      callback(devices);
    });
  }
}
