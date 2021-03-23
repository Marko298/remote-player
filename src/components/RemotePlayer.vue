<template>
  <span
    class="absolute top-0 left-0 mt-3 ml-3 block h-3 w-3 rounded-full z-10"
    :class="{
      'bg-green-400': isConnected,
      'bg-red-400 animate-pulse': !isConnected,
    }"
  />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { RemotePlayerController } from "@/player/RemotePlayerController";
import { namespace } from "vuex-class";
import { Socket } from "@/player/Socket";

const player = namespace("remotePlayer");

@Component({})
export default class RemotePlayer extends Vue {
  @player.State("player") player?: RemotePlayerController;
  @player.Action("setPlayer") setPlayer;

  isConnected = false;

  createRemotePlayer() {
    const socket = new Socket(this.$socket, this.sockets);

    this.setPlayer(new RemotePlayerController(socket));
  }

  mounted() {
    this.isConnected = this.$socket.connected;

    this.sockets.subscribe("connect", () => {
      this.isConnected = true;

      if (!this.player) {
        this.createRemotePlayer();
      }
    });

    this.sockets.subscribe("disconnect", () => {
      this.isConnected = false;
    });
  }
}
</script>
