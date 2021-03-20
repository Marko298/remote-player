<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 h-screen">
    <div class="mx-auto flex flex-col content-center max-w-sm">
      <player />
      <device-selector />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import DeviceSelector from "@/components/DeviceSelector.vue";
import Player from "@/components/Player.vue";

@Component({
  components: {
    Player,
    DeviceSelector,
  },
})
export default class App extends Vue {}
</script>

<style>
body {
  background-image: linear-gradient(
    -134deg,
    #c182dc 0%,
    #fb7c62 94%,
    #ff7c5b 100%
  );
}
</style>
