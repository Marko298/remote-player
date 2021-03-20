<template>
  <div class="relative">
    <connection-status />

    <player-interface
      :name="currentSong.name"
      :artist="currentSong.artist"
      :is-playing="isPlaying"
      :duration="normalizedDuration"
      :played="playedDuration"
      :cover="currentSong.cover"
      @next="nextSong"
      @prev="prevSong"
      @seek="seekSong"
      @toggle="togglePlayback"
    />

    <audio hidden :src="currentSong.url" id="audio" ref="audio" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import PlayerInterface from "@/components/PlayerInterface.vue";
import { Action, Getter, State } from "vuex-class";
import { Song, SongMetadata } from "@/store";
import ConnectionStatus from "@/components/ConnectionStatus.vue";
import { HtmlPlayer } from "@/player/HtmlPlayer";

@Component({
  components: { ConnectionStatus, PlayerInterface },
})
export default class Player extends Vue {
  @Getter("currentSong") currentSong?: Song;

  @State("isPlaying") isPlaying: boolean;
  @State("playedDuration") playedDuration: number;
  @State("currentSongMetadata") currentSongMetadata?: SongMetadata;

  @Action("setLocalPlayer") setLocalPlayer;
  @Action("togglePlayback") togglePlayback;
  @Action("seekSong") seekSong;
  @Action("nextSong") nextSong;
  @Action("prevSong") prevSong;

  mounted() {
    this.setLocalPlayer(new HtmlPlayer(this.$refs.audio as HTMLAudioElement));
  }

  get normalizedDuration() {
    return this.currentSongMetadata?.duration ?? 0;
  }
}
</script>
