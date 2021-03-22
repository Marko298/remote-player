import { PlayerState, Song } from "@/player/PlayerState";
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
  },
  mutations: {
    SET_PLAYER(state, player: HTMLAudioElement) {
      state.player = player;
    },
    SET_SONG(state, song: Song) {
      state.isReady = false;
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
  },
  getters: {
    currentSongIndex(state) {
      return state.currentSong && state.playlist.indexOf(state.currentSong);
    },
    currentSongSource(state) {
      return state.currentSong?.url;
    },
    player(state) {
      return state.player;
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

    seek({ getters }, { time }: { time: number }) {
      getters.player.currentTime = time;
    },

    ended({ dispatch }) {
      dispatch("nextSong");
    },

    setState({ dispatch, commit }, playerState: PlayerState) {
      commit("SET_SONG", playerState.song);
      commit("SET_WAS_PLAYING", playerState.isPlaying);

      if (playerState.currentPosition !== 0) {
        dispatch("seek", { time: playerState.currentPosition });
      }
    },
  },
};
