import Vue from "vue";
import Vuex, { GetterTree } from "vuex";
import playlist from "@/store/playlist";
import { PlayerInterface } from "@/player/PlayerInterface";
import { HtmlPlayer } from "@/player/HtmlPlayer";
import { NonePlayer } from "@/player/NonePlayer";

Vue.use(Vuex);

export interface Device {
  id: number;
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
  isConnected: boolean;
  devices: Device[];
  playlist: Song[];
  isPlaying: boolean;
  isReady: boolean;
  lastPlayingState: boolean;
  activeDeviceId: number;
  currentSongId: number;
  playedDuration: number;
  localPlayer: PlayerInterface;
  currentSongMetadata?: SongMetadata;
}

export interface Getters {
  activePlayer(state: State): PlayerInterface;
}

const getters: GetterTree<State, any> & Getters = {
  currentSong(state) {
    return state.playlist.find(({ id }) => id === state.currentSongId);
  },
  activePlayer(state): PlayerInterface {
    return state.localPlayer;
  },
  currentSongIndex(state, getters): number {
    return state.playlist.indexOf(getters.currentSong);
  },
};

export default new Vuex.Store<State>({
  state: {
    localPlayer: new NonePlayer(),
    isConnected: false,
    activeDeviceId: 1,
    currentSongId: 1,
    currentSongMetadata: undefined,
    lastPlayingState: false,
    isPlaying: false,
    isReady: false,
    playedDuration: 0,
    playlist: playlist,
    devices: [
      { id: 1, name: "Mark's Macbook Air" },
      { id: 2, name: "Mark's Macbook Pro" },
      { id: 3, name: "Mark's iPhone" },
      { id: 4, name: "Mark's iPad" },
    ],
  },
  mutations: {
    SET_SOCKET_STATE(state, connected: boolean) {
      state.isConnected = connected;
    },
    SET_ACTIVE_DEVICE(state, id: number) {
      state.activeDeviceId = id;
    },
    SET_LOCAL_PLAYER(state, player: PlayerInterface) {
      state.localPlayer = player;
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
  },
  actions: {
    socket_connect({ commit }, asd) {
      console.log(asd);
      commit("SET_SOCKET_STATE", true);
    },

    socket_disconnect({ commit }) {
      commit("SET_SOCKET_STATE", false);
    },

    setActiveDevice({ commit }, id: number) {
      commit("SET_ACTIVE_DEVICE", id);
    },

    async setLocalPlayer({ commit, dispatch }, element: HTMLAudioElement) {
      const player = new HtmlPlayer(element);
      await dispatch("setActivePlayer", player);
      commit("SET_LOCAL_PLAYER", player);
    },

    setActivePlayer({ commit, dispatch }, player: PlayerInterface) {
      player.onTimeUpdate((time) => {
        commit("SET_PLAYED_DURATION", time);
      });
      player.onPlaying(() => {
        commit("SET_IS_PLAYING", true);
      });
      player.onPause(() => {
        commit("SET_IS_PLAYING", false);
      });
      player.onLoadedMetadata((meta) => {
        commit("SET_CURRENT_SONG_METADATA", meta);
      });
      player.onReady(() => {
        dispatch("setPlayerReady");
      });
      player.onEnded(() => {
        dispatch("nextSong");
      });
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
  getters,
  modules: {},
});
