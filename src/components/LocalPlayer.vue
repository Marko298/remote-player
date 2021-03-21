<template>
  <audio :src="currentSong.url" id="audio" ref="audio" hidden />
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "LocalPlayer",
  methods: mapActions("localPlayer", ["setPlayer"]),
  computed: mapGetters("localPlayer", ["currentSong"]),
  mounted() {
    this.setPlayer(this.$refs.audio);
  },
};
</script>

<style scoped></style>
