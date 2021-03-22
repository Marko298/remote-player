<template>
  <audio :src="currentSongSource" id="audio" ref="audio" hidden />
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "LocalPlayer",
  methods: mapActions("localPlayer", ["setPlayer", "ready"]),
  computed: mapGetters("localPlayer", ["currentSongSource"]),
  mounted() {
    this.setPlayer(this.$refs.audio);

    const listener = () => this.ready();

    document.addEventListener("click", listener, { once: true });
  },
};
</script>

<style scoped></style>
