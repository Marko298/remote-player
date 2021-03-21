import { Module } from "vuex";
import { GlobalState } from "@/store/index";
import { RemotePlayerController } from "@/player/RemotePlayerController";
import { Device, PlayerState } from "@/player/PlayerState";
import { myId } from "@/id";

interface State {
  player?: RemotePlayerController;
  state?: PlayerState;
  devices: Device[];
  activeDeviceId: string;
}

const me = { id: myId, name: "Current machine" };

export function remotePlayerPlugin() {
  return (store) => {
    store.watch(
      (state, getters) => getters["localPlayer/state"],
      () => store.dispatch("remotePlayer/sendLocalState")
    );
  };
}

export const RemotePlayer: Module<State, GlobalState> = {
  namespaced: true,
  state: {
    player: undefined,
    state: undefined,
    devices: [me],
    activeDeviceId: me.id,
  },
  mutations: {
    SET_PLAYER(state, player: RemotePlayerController) {
      state.player = player;
    },
    SET_STATE(state, playerState: PlayerState) {
      state.state = playerState;
    },
    SET_REMOTE_DEVICES(state, devices: Device[]) {
      state.devices = [me, ...devices.filter(({ id }) => id !== me.id)];
    },
    SET_ACTIVE_DEVICE(state, deviceId: string) {
      state.activeDeviceId = deviceId;
    },
  },
  getters: {
    isReady(state) {
      return Boolean(state.player);
    },
    player(state) {
      return state.player;
    },
    state(s): PlayerState | undefined {
      return s.state;
    },
    isMaster(state) {
      return state.activeDeviceId === myId;
    },
  },
  actions: {
    setPlayer({ commit, dispatch }, player: RemotePlayerController) {
      player.onCommand((command, payload) => {
        dispatch(command, payload, { root: true });
      });

      player.onStateChange((state) => {
        commit("SET_STATE", state);
      });

      player.onDeviceListChange((devices) => {
        commit("SET_REMOTE_DEVICES", devices);
      });

      player.onDeviceChange((device) => {
        if (device?.id === me.id) {
          dispatch("sendLocalState");
        }

        commit("SET_ACTIVE_DEVICE", device?.id ?? me.id);
      });

      commit("SET_PLAYER", player);
    },
    play({ getters }) {
      getters.player.command("play");
    },
    pause({ getters }) {
      getters.player.command("pause");
    },
    toggle({ getters }) {
      getters.player.command("toggle");
    },
    seek({ getters }, { time }: { time: number }) {
      getters.player.command("seek", { time });
    },
    nextSong({ getters }) {
      getters.player.command("nextSong");
    },
    prevSong({ getters }) {
      getters.player.command("prevSong");
    },
    switchToDevice({ getters }, id: string) {
      getters.player.switchTo(id);
    },
    sendLocalState({ getters, rootGetters }) {
      getters.isMaster &&
        getters.player &&
        getters.player.sendState(rootGetters["localPlayer/state"]);
    },
  },
};
