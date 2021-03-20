import Vue from "vue";
import Vuex from "vuex";
import playlist from "@/store/playlist";
import {
  PlayerInterface,
  RemotePlayerInterface,
} from "@/player/PlayerInterface";
import { NonePlayer } from "@/player/NonePlayer";
import { v4 } from "uuid";
import { myId } from "@/id";

Vue.use(Vuex);

export interface Device {
  id: string;
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

export interface State {
  devices: Device[];
  playlist: Song[];
  isPlaying: boolean;
  isReady: boolean;
  lastPlayingState: boolean;
  activeDeviceId: string;
  currentSongId: number;
  playedDuration: number;
  localPlayer: PlayerInterface;
  remotePlayer?: PlayerInterface;
  currentSongMetadata?: SongMetadata;
}

export default new Vuex.Store<State>({
  state: {
    localPlayer: new NonePlayer(),
    remotePlayer: undefined,
    activeDeviceId: myId,
    currentSongId: 1,
    currentSongMetadata: undefined,
    lastPlayingState: false,
    isPlaying: false,
    isReady: false,
    playedDuration: 0,
    playlist: playlist,
    devices: [{ id: myId, name: "Current machine" }],
  },
  mutations: {
    SET_ACTIVE_DEVICE(state, id: string) {
      state.activeDeviceId = id;
    },
    SET_LOCAL_PLAYER(state, player: PlayerInterface) {
      state.localPlayer = player;
    },
    SET_REMOTE_PLAYER(state, player: PlayerInterface) {
      state.remotePlayer = player;
    },
    SET_CURRENT_SONG(state, id: number) {
      state.lastPlayingState = state.isPlaying;
      state.currentSongId = id;
      state.isReady = false;
    },
    SET_CURRENT_SONG_METADATA(state, metadata: SongMetadata) {
      state.currentSongMetadata = metadata;
    },
    SET_IS_PLAYING(state, isPlaying: boolean) {
      state.isPlaying = isPlaying;
    },
    SET_PLAYED_DURATION(state, duration: number) {
      state.playedDuration = duration;
    },
    SET_PLAYER_STATE(state, isReady: boolean) {
      state.isReady = isReady;
    },
    SET_LAST_PLAYING_STATE(state, wasPlaying: boolean) {
      state.lastPlayingState = wasPlaying;
    },
    SET_REMOTE_DEVICES(state, devices: Device[]) {
      state.devices = [
        state.devices.find(({ id }) => id === myId)!,
        ...devices.filter(({ id }) => id !== myId),
      ];
    },
  },
  actions: {
    setActiveDevice({ commit }, id: number) {
      commit("SET_ACTIVE_DEVICE", id);
    },

    async setLocalPlayer({ commit, dispatch }, player: PlayerInterface) {
      commit("SET_LOCAL_PLAYER", player);
    },

    async setRemotePlayer({ commit, dispatch }, player: RemotePlayerInterface) {
      await dispatch("setActivePlayer", player);

      commit("SET_REMOTE_DEVICES", player.devices);

      player.onDevicesChanged((devices) =>
        commit("SET_REMOTE_DEVICES", devices)
      );

      commit("SET_REMOTE_PLAYER", player);
    },

    setActivePlayer({ commit, dispatch }, player: PlayerInterface) {
      const callbacks = {
        onTimeUpdate: (time) => {
          commit("SET_PLAYED_DURATION", time);
        },
        onPlaying: () => {
          commit("SET_IS_PLAYING", true);
        },
        onPause: () => {
          commit("SET_IS_PLAYING", false);
        },
        onLoadedMetadata: (meta) => {
          commit("SET_CURRENT_SONG_METADATA", meta);
        },
        onReady: () => {
          dispatch("setPlayerReady");
        },
        onEnded: () => {
          dispatch("nextSong");
        },
      };

      for (const key in callbacks) {
        player[key](callbacks[key]);
      }

      // player.onTimeUpdate((time) => {
      //   commit("SET_PLAYED_DURATION", time);
      // });
      // player.onPlaying(() => {
      //   commit("SET_IS_PLAYING", true);
      // });
      // player.onPause(() => {
      //   commit("SET_IS_PLAYING", false);
      // });
      // player.onLoadedMetadata((meta) => {
      //   commit("SET_CURRENT_SONG_METADATA", meta);
      // });
      // player.onReady(() => {
      //   dispatch("setPlayerReady");
      // });
      // player.onEnded(() => {
      //   dispatch("nextSong");
      // });
    },

    togglePlayback({ getters }) {
      getters.activePlayer.toggle();
    },

    play({ getters }) {
      getters.activePlayer.play();
    },

    nextSong({ state, commit, getters }) {
      const index = getters.currentSongIndex;
      const newIndex = state.playlist.length === index + 1 ? 0 : index + 1;

      commit("SET_CURRENT_SONG", state.playlist[newIndex].id);
    },

    prevSong({ state, commit, getters }) {
      const index = getters.currentSongIndex;
      const newIndex = index === 0 ? state.playlist.length - 1 : index - 1;

      commit("SET_CURRENT_SONG", state.playlist[newIndex].id);
    },

    seekSong({ commit, getters }, time: number) {
      getters.activePlayer.seekTo(time);

      commit("SET_PLAYED_DURATION", time);
    },

    setPlayerReady({ commit, state, dispatch }) {
      commit("SET_PLAYER_STATE", true);

      if (state.lastPlayingState) {
        dispatch("togglePlayback");
      }

      commit("SET_LAST_PLAYING_STATE", false);
    },
  },
  getters: {
    currentSong(state) {
      return state.playlist.find(({ id }) => id === state.currentSongId);
    },
    activePlayer(state): PlayerInterface {
      return state.activeDeviceId !== myId && state.remotePlayer
        ? state.remotePlayer
        : state.localPlayer;
    },
    currentSongIndex(state, getters): number {
      return state.playlist.indexOf(getters.currentSong);
    },
  },
  modules: {},
});
