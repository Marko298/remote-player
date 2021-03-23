import { Module } from "vuex";
import { GlobalState } from "@/store/index";
import { PlayerState } from "@/player/RemotePlayer";

export const PlayerControls: Module<undefined, GlobalState> = {
  getters: {
    playerState(state, getters, rootState, rootGetter): PlayerState {
      return getters.shouldUseLocalPlayer
        ? rootGetter["localPlayer/state"]
        : rootGetter["remotePlayer/state"];
    },
    shouldUseLocalPlayer(state, getters, rootState, rootGetter): PlayerState {
      return (
        rootGetter["remotePlayer/isMaster"] ||
        rootGetter["remotePlayer/noMaster"]
      );
    },
    noMaster(state, getters, rootState, rootGetter): boolean {
      return rootGetter["remotePlayer/noMaster"];
    },
  },
  actions: {
    play({ dispatch, getters }) {
      getters.shouldUseLocalPlayer
        ? dispatch("localPlayer/play")
        : dispatch("remotePlayer/play");
    },
    pause({ dispatch, getters }) {
      getters.shouldUseLocalPlayer
        ? dispatch("localPlayer/pause")
        : dispatch("remotePlayer/pause");
    },
    toggle({ dispatch, getters }) {
      if (getters.playerState.isPlaying) {
        getters.shouldUseLocalPlayer
          ? dispatch("localPlayer/pause")
          : dispatch("remotePlayer/pause");
      } else {
        getters.shouldUseLocalPlayer
          ? dispatch("localPlayer/play")
          : dispatch("remotePlayer/play");

        if (getters.shouldUseLocalPlayer && getters.noMaster) {
          dispatch("remotePlayer/setMyselfAsMaster");
        }
      }
    },
    seek({ dispatch, getters }, time: number) {
      getters.shouldUseLocalPlayer
        ? dispatch("localPlayer/seek", time)
        : dispatch("remotePlayer/seek", time);
    },
    nextSong({ dispatch, getters }) {
      getters.shouldUseLocalPlayer
        ? dispatch("localPlayer/nextSong")
        : dispatch("remotePlayer/nextSong");
    },
    prevSong({ dispatch, getters }) {
      getters.shouldUseLocalPlayer
        ? dispatch("localPlayer/prevSong")
        : dispatch("remotePlayer/prevSong");
    },
  },
};
