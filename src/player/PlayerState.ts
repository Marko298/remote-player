export interface Device {
  id: string;
  number?: string;
  name: string;
}

export interface Song {
  id: number;
  name: string;
  artist: string;
  url: string;
  cover: string;
}

export interface SongMetadata {
  duration: number;
}

export interface PlayerState {
  song?: Song;
  duration: number;
  currentPosition: number;
  isPlaying: boolean;
  isReady: boolean;
}

export type RemoteCommand =
  | "play"
  | "pause"
  | "toggle"
  | "nextSong"
  | "prevSong"
  | "seek";

export type RemoteCommandPayload = Record<string, any>;

export type CommandCallback = (
  command: RemoteCommand,
  payload: RemoteCommandPayload
) => void;

export type StateChangeCallback = (state: PlayerState) => void;
