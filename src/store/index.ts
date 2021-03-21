import Vue from "vue";
import Vuex from "vuex";
import { LocalPlayer } from "@/store/local-player";
import { RemotePlayer } from "@/store/remote-player";
import { PlayerControls } from "@/store/player-controls";
import { myId } from "@/id";

Vue.use(Vuex);

export interface GlobalState {
  id: string;
}

export default new Vuex.Store<GlobalState>({
  state: {
    id: myId,
  },
  modules: {
    controls: PlayerControls,
    localPlayer: LocalPlayer,
    remotePlayer: RemotePlayer,
  },
});
