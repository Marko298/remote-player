<template>
  <audio id="audio" ref="audio" :src="source" hidden />
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "LocalPlayer",
  methods: mapActions("localPlayer", ["setPlayer", "ready"]),
  computed: {
    ...mapState("localPlayer", ["currentSong"]),
    source() {
      return this.currentSong?.url;
    },
  },
  mounted() {
    this.setPlayer(this.$refs.audio);

    document.addEventListener("click", () => this.ready(), { once: true });
  },
};
</script>

<style scoped></style>
