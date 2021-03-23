import { PlayerState, Song } from "@/player/RemotePlayer";
import playlist from "@/playlist";
import { Module } from "vuex";
import { GlobalState } from "@/store/index";

interface State {
  player?: HTMLAudioElement;
  playlist: Song[];
  currentSong?: Song;
  duration: number;
  currentPosition: number;
  startPlayingWhenCan: boolean;
  isPlaying: boolean;
  isReady: boolean;
  canPlayCallbacks: (() => void)[];
}

export const LocalPlayer: Module<State, GlobalState> = {
  namespaced: true,
  state: {
    player: undefined,
    playlist: playlist,
    currentSong: playlist[0],
    currentPosition: 0,
    duration: 0,
    startPlayingWhenCan: false,
    isPlaying: false,
    isReady: false,
    canPlayCallbacks: [],
  },
  mutations: {
    SET_PLAYER(state, player: HTMLAudioElement) {
      state.player = player;
    },
    SET_SONG(state, song: Song) {
      state.startPlayingWhenCan = state.isPlaying;
      state.currentSong = song;
    },
    SET_POSITION(state, position: number) {
      state.currentPosition = position;
    },
    SET_READY(state, isReady: boolean) {
      state.isReady = isReady;
    },
    SET_PLAYING(state, isPlaying: boolean) {
      state.isPlaying = isPlaying;
    },
    SET_DURATION(state, duration: number) {
      state.duration = duration;
    },
    SET_WAS_PLAYING(state, wasPlaying) {
      state.startPlayingWhenCan = wasPlaying;
    },
    ADD_CAN_PLAY_CALLBACK(state, callback) {
      state.canPlayCallbacks.push(callback);
    },
    CLEAR_CAN_PLAY_CALLBACKS(state) {
      state.canPlayCallbacks = [];
    },
  },
  getters: {
    currentSongIndex(state) {
      const songInPlaylist = state.playlist.find(
        ({ id }) => id === state.currentSong?.id
      );

      if (!songInPlaylist) {
        return console.warn("Song not found in playlist");
      }

      return state.playlist.indexOf(songInPlaylist);
    },
    player(state) {
      return state.player;
    },
    isReady(state) {
      return state.isReady;
    },
    state(state): PlayerState {
      return {
        currentPosition: state.currentPosition,
        isPlaying: state.isPlaying,
        isReady: state.isReady,
        song: state.currentSong,
        duration: state.duration,
      };
    },
  },
  actions: {
    setPlayer({ commit, dispatch }, player) {
      player.onplaying = () => commit("SET_PLAYING", true);
      player.onpause = () => commit("SET_PLAYING", false);
      player.oncanplay = () => dispatch("canPlay");
      player.onloadedmetadata = (e) => {
        commit("SET_DURATION", e.target.duration);
      };
      player.ontimeupdate = (e) => {
        commit("SET_POSITION", e.target.currentTime);

        if (e.target.currentTime === e.target.duration) {
          dispatch("ended");
        }
      };

      commit("SET_PLAYER", player);
    },

    ready({ commit }) {
      commit("SET_READY", true);
    },

    canPlay({ state, dispatch }) {
      // state.canPlayCallbacks.forEach((callback) => callback());
      // commit("CLEAR_CAN_PLAY_CALLBACKS");

      state.startPlayingWhenCan && dispatch("play");
    },

    nextSong({ state, commit, getters }) {
      const newIndex =
        getters.currentSongIndex === state.playlist.length - 1
          ? 0
          : getters.currentSongIndex + 1;

      commit("SET_SONG", state.playlist[newIndex]);
    },

    prevSong({ state, commit, getters }) {
      const newIndex =
        getters.currentSongIndex === 0
          ? state.playlist.length - 1
          : getters.currentSongIndex - 1;

      commit("SET_SONG", state.playlist[newIndex]);
    },

    play({ getters }) {
      return getters.player.play();
    },

    pause({ getters }) {
      getters.player.pause();
    },

    toggle({ state, dispatch }) {
      state.isPlaying ? dispatch("pause") : dispatch("play");
    },

    seek({ getters }, time: number) {
      getters.player.currentTime = time;
    },

    ended({ dispatch }) {
      dispatch("nextSong");
    },

    async applyState({ dispatch, commit }, playerState: PlayerState) {
      commit("SET_SONG", playerState.song);
      commit("SET_WAS_PLAYING", playerState.isPlaying);
      dispatch("seek", playerState.currentPosition);
    },
  },
};
