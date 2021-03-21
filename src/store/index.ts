import Vue from "vue";
import Vuex, { createLogger } from "vuex";
import { LocalPlayer } from "@/store/local-player";
import { RemotePlayer, remotePlayerPlugin } from "@/store/remote-player";
import { PlayerControls } from "@/store/player-controls";
import { myId } from "@/id";

const isDev = process.env.NODE_ENV !== "production";

Vue.use(Vuex);

export interface GlobalState {
  id: string;
}

const plugins = [remotePlayerPlugin()];

export default new Vuex.Store<GlobalState>({
  plugins: isDev ? [createLogger(), ...plugins] : plugins,
  state: {
    id: myId,
  },
  modules: {
    controls: PlayerControls,
    localPlayer: LocalPlayer,
    remotePlayer: RemotePlayer,
  },
});
