export interface Device {
  id: string;
  name: string;
  ready: boolean;
}

export interface Song {
  id: number;
  name: string;
  artist: string;
  url: string;
  cover: string;
}

export interface PlayerState {
  song?: Song;
  duration: number;
  currentPosition: number;
  isPlaying: boolean;
  isReady: boolean;
}

export interface InitialState {
  master?: string;
  state?: PlayerState;
  devices: Device[];
}

export type RemoteCommand =
  | "play"
  | "pause"
  | "toggle"
  | "nextSong"
  | "prevSong"
  | "seek";

export type RemoteCommandPayload = unknown;

export type CommandCallback = (
  command: RemoteCommand,
  payload: RemoteCommandPayload
) => void;

export type StateChangeCallback = (state: PlayerState) => void;
export type DeviceListChangeCallback = (devices: Device[]) => void;
export type BecameMasterCallback = (state?: PlayerState) => void;
export type MasterChangeCallback = (
  master?: string,
  state?: PlayerState
) => void;
