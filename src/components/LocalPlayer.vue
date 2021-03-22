<template>
  <audio id="audio" ref="audio" :src="source" hidden />
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "LocalPlayer",
  methods: mapActions("localPlayer", ["setPlayer", "ready"]),
  computed: {
    source() {
      return this.$store.state.localPlayer.currentSong?.url;
    },
  },
  mounted() {
    this.setPlayer(this.$refs.audio);

    document.addEventListener("click", () => this.ready(), { once: true });
  },
};
</script>

<style scoped></style>
