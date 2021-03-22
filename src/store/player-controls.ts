import { Module } from "vuex";
import { GlobalState } from "@/store/index";
import { PlayerState } from "@/player/PlayerState";

export const PlayerControls: Module<undefined, GlobalState> = {
  getters: {
    playerState(state, getters, rootState, rootGetter): PlayerState {
      return getters.isMaster
        ? rootGetter["localPlayer/state"]
        : rootGetter["remotePlayer/state"];
    },
    isMaster(state, getters, rootState, rootGetter): PlayerState {
      return rootGetter["remotePlayer/isMaster"];
    },
  },
  actions: {
    play({ dispatch, getters }) {
      getters.isMaster
        ? dispatch("localPlayer/play")
        : dispatch("remotePlayer/play");
    },
    pause({ dispatch, getters }) {
      getters.isMaster
        ? dispatch("localPlayer/pause")
        : dispatch("remotePlayer/pause");
    },
    toggle({ dispatch, getters }) {
      getters.isMaster
        ? dispatch("localPlayer/toggle")
        : dispatch("remotePlayer/toggle");
    },
    seek({ dispatch, getters }, time: number) {
      getters.isMaster
        ? dispatch("localPlayer/seek", time)
        : dispatch("remotePlayer/seek", time);
    },
    nextSong({ dispatch, getters }) {
      getters.isMaster
        ? dispatch("localPlayer/nextSong")
        : dispatch("remotePlayer/nextSong");
    },
    prevSong({ dispatch, getters }) {
      getters.isMaster
        ? dispatch("localPlayer/prevSong")
        : dispatch("remotePlayer/prevSong");
    },
  },
};
