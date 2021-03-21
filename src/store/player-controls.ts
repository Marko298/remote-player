import { Module } from "vuex";
import { GlobalState } from "@/store/index";
import { PlayerState } from "@/player/PlayerState";

interface State {
  controllingRemote: boolean;
}

export const PlayerControls: Module<State, GlobalState> = {
  state: {
    controllingRemote: false,
  },
  getters: {
    playerState(state, getters, rootState, rootGetter): PlayerState {
      return rootGetter["localPlayer/state"];
    },
  },
  actions: {
    play({ dispatch }) {
      dispatch("localPlayer/play");
    },
    pause({ dispatch }) {
      dispatch("localPlayer/pause");
    },
    toggle({ dispatch }) {
      dispatch("localPlayer/toggle");
    },
    seek({ dispatch }, payload) {
      dispatch("localPlayer/seek", payload);
    },
    nextSong({ dispatch }) {
      dispatch("localPlayer/nextSong");
    },
    prevSong({ dispatch }) {
      dispatch("localPlayer/prevSong");
    },
  },
};
