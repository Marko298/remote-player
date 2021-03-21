import { PlayerState, Song } from "@/player/PlayerState";
import playlist from "@/playlist";
import { Module } from "vuex";
import { GlobalState } from "@/store/index";

interface State {
  player?: HTMLAudioElement;
  playlist: Song[];
  currentSongIndex: number;
  duration: number;
  currentPosition: number;
  wasPlaying: boolean;
  isPlaying: boolean;
  isReady: boolean;
}

export const LocalPlayer: Module<State, GlobalState> = {
  namespaced: true,
  state: {
    player: undefined,
    playlist: playlist,
    currentSongIndex: 0,
    currentPosition: 0,
    duration: 0,
    wasPlaying: false,
    isPlaying: false,
    isReady: false,
  },
  mutations: {
    SET_PLAYER(state, player: HTMLAudioElement) {
      state.player = player;
    },
    SET_SONG_INDEX(state, newIndex: number) {
      state.isReady = false;
      state.wasPlaying = state.isPlaying;
      state.currentSongIndex = newIndex;
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
  },
  getters: {
    currentSong(state) {
      return state.playlist[state.currentSongIndex];
    },
    player(state) {
      return state.player;
    },
    state(state, getters): PlayerState {
      return {
        currentPosition: state.currentPosition,
        isPlaying: state.isPlaying,
        isReady: state.isReady,
        song: getters.currentSong,
        duration: state.duration,
      };
    },
  },
  actions: {
    setPlayer({ commit, dispatch }, player) {
      player.onplaying = () => commit("SET_PLAYING", true);
      player.onpause = () => commit("SET_PLAYING", false);
      player.oncanplay = () => dispatch("ready");
      player.ontimeupdate = (e) => commit("SET_POSITION", e.target.currentTime);
      player.onloadedmetadata = (e) =>
        commit("SET_DURATION", e.target.duration);

      commit("SET_PLAYER", player);
    },

    ready({ state, commit, dispatch }) {
      commit("SET_READY", true);
      state.wasPlaying && dispatch("play");
    },

    nextSong({ state, commit }) {
      commit(
        "SET_SONG_INDEX",
        state.currentSongIndex === state.playlist.length - 1
          ? 0
          : state.currentSongIndex + 1
      );
    },

    prevSong({ state, commit }) {
      commit(
        "SET_SONG_INDEX",
        state.currentSongIndex === 0
          ? state.playlist.length - 1
          : state.currentSongIndex - 1
      );
    },

    play({ getters }) {
      getters.player.play();
    },

    pause({ getters }) {
      getters.player.pause();
    },

    toggle({ state, dispatch }) {
      state.isPlaying ? dispatch("pause") : dispatch("play");
    },

    seek({ getters }, { time }: { time: number }) {
      getters.player.currentTime = time;
    },
  },
};
