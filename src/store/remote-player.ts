import { Module } from "vuex";
import { GlobalState } from "@/store/index";
import { RemotePlayerController } from "@/player/RemotePlayerController";
import { Device, PlayerState } from "@/player/PlayerState";
import { myId } from "@/id";

interface State {
  player?: RemotePlayerController;
  state?: PlayerState;
  devices: Device[];
  activeDeviceId?: string;
}

const me = { id: myId, name: "Current device" };

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
    devices: [],
    activeDeviceId: undefined,
  },
  mutations: {
    SET_PLAYER(state, player: RemotePlayerController) {
      state.player = player;
    },
    SET_STATE(state, playerState: PlayerState) {
      state.state = playerState;
    },
    SET_REMOTE_DEVICES(state, devices: Device[]) {
      state.devices = devices
        .sort((a) => (a.id === me.id ? -1 : 1)) //This device first
        .map((device) =>
          device.id !== me.id
            ? device
            : {
                ...device,
                name: device.name + " (this)", //add (this) to this device name
              }
        );
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
      return !state.activeDeviceId || state.activeDeviceId === myId;
    },
  },
  actions: {
    setPlayer({ commit, dispatch, getters }, player: RemotePlayerController) {
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
        const wasMaster = getters.isMaster;
        commit("SET_ACTIVE_DEVICE", device?.id ?? me.id);

        if (wasMaster) {
          dispatch("localPlayer/pause", {}, { root: true });
        }
      });

      player.onBecameMaster((playerState) => {
        commit("SET_ACTIVE_DEVICE", me.id);
        dispatch("sendLocalState");

        if (playerState) {
          dispatch("localPlayer/setState", playerState, { root: true });
        }
      });

      player.connect();

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
