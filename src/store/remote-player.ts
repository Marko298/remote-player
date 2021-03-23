import { Module } from "vuex";
import { GlobalState } from "@/store/index";
import { RemotePlayerController } from "@/player/RemotePlayerController";
import { Device, PlayerState } from "@/player/RemotePlayer";
import { myId } from "@/id";
import { prettifyDeviceList } from "@/store/utils";

interface State {
  player?: RemotePlayerController;
  state?: PlayerState;
  devices: Device[];
  activeDeviceId?: string;
}

export function remotePlayerPlugin() {
  return (store) => {
    store.watch(
      (state, getters) => getters["localPlayer/state"],
      (state) =>
        store.getters["remotePlayer/player"] &&
        store.getters["remotePlayer/shouldSendLocalState"] &&
        store.dispatch("remotePlayer/sendLocalState", state)
    );

    store.watch(
      (state, getters) => getters["localPlayer/isReady"],
      (isReady) =>
        isReady &&
        store.getters["remotePlayer/player"] &&
        store.dispatch("remotePlayer/localPlayerIsReady")
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
    SET_REMOTE_STATE(state, playerState: PlayerState) {
      state.state = playerState;
    },
    SET_REMOTE_DEVICES(state, devices: Device[]) {
      state.devices = prettifyDeviceList(devices, myId);
    },
    SET_ACTIVE_DEVICE(state, deviceId: string) {
      state.activeDeviceId = deviceId;
    },
  },
  getters: {
    player(state) {
      return state.player;
    },
    state(s): PlayerState | undefined {
      return s.state;
    },
    isMaster(state): boolean {
      return state.activeDeviceId === myId;
    },
    noMaster(state): boolean {
      return !state.activeDeviceId;
    },
    shouldSendLocalState(state, getters): boolean {
      return !getters.noMaster && getters.isMaster;
    },
    localPlayerState(state, getters, rootState, rootGetters): PlayerState {
      return rootGetters["localPlayer/state"];
    },
    isLocalPlayerReady(state, getters, rootState, rootGetters): boolean {
      return rootGetters["localPlayer/isReady"];
    },
  },
  actions: {
    async setPlayer(
      { commit, dispatch, getters },
      player: RemotePlayerController
    ) {
      player.onCommand((command, payload) => {
        dispatch(command, payload, { root: true });
      });

      player.onStateChange((playerState) => {
        commit("SET_REMOTE_STATE", playerState);
      });

      player.onDeviceListChange((devices) => {
        commit("SET_REMOTE_DEVICES", devices);
      });

      player.onMasterChange((masterId, masterState) => {
        commit("SET_REMOTE_STATE", masterState);
        getters.isMaster && dispatch("pauseLocalPlayer");
        commit("SET_ACTIVE_DEVICE", masterId);
      });

      player.onBecameMaster((playerState) => {
        commit("SET_ACTIVE_DEVICE", myId);

        player.confirmBecameMaster(playerState ?? getters.localPlayerState);

        playerState && dispatch("applyStateToLocalPlayer", playerState);
      });

      const { devices, master, state } = await player.connect();

      commit("SET_REMOTE_DEVICES", devices);
      commit("SET_ACTIVE_DEVICE", master);
      commit("SET_REMOTE_STATE", state);
      commit("SET_PLAYER", player);

      if (getters.isLocalPlayerReady) {
        dispatch("localPlayerIsReady");
      }
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
    seek({ getters }, time: number) {
      getters.player.command("seek", time);
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
    setMyselfAsMaster({ getters }) {
      getters.player.switchTo(myId);
    },
    localPlayerIsReady({ getters }) {
      getters.player.ready();
    },
    sendLocalState({ getters }, playerState: PlayerState) {
      getters.player.sendState(playerState);
    },
    pauseLocalPlayer({ dispatch }) {
      dispatch("localPlayer/pause", {}, { root: true });
    },
    async applyStateToLocalPlayer({ dispatch }, playerState: PlayerState) {
      await dispatch("localPlayer/applyState", playerState, { root: true });
    },
  },
};
