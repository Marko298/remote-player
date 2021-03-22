<template>
  <span
    class="absolute top-0 left-0 mt-3 ml-3 block h-3 w-3 rounded-full z-10"
    :class="isConnected ? 'bg-green-400' : 'bg-red-400 animate-pulse'"
  />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { RemotePlayerController } from "@/player/RemotePlayerController";
import { Action } from "vuex-class";
import { Socket } from "@/player/Socket";

@Component({})
export default class RemotePlayer extends Vue {
  @Action("remotePlayer/setPlayer") setPlayer;

  isConnected = false;
  playerCreated = false;

  createRemotePlayer() {
    if (this.playerCreated) {
      return;
    }

    const socket = new Socket(this.$socket, this.sockets);

    this.setPlayer(new RemotePlayerController(socket));
  }

  mounted() {
    this.isConnected = this.$socket.connected;

    this.sockets.subscribe("connect", () => {
      this.isConnected = true;
      this.createRemotePlayer();
    });

    this.sockets.subscribe("disconnect", () => {
      this.isConnected = false;
    });
  }
}
</script>
