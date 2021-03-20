<template>
  <span
    class="absolute top-0 left-0 mt-3 ml-3 block h-3 w-3 rounded-full z-10"
    :class="isConnected ? 'bg-green-400' : 'bg-red-400 animate-pulse'"
  />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class ConnectionStatus extends Vue {
  isConnected = false;

  mounted() {
    this.isConnected = this.$socket.connected;

    this.sockets.subscribe("connect", () => {
      this.isConnected = true;
    });

    this.sockets.subscribe("disconnect", () => {
      this.isConnected = false;
    });
  }
}
</script>
