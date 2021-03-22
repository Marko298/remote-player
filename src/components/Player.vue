<template>
  <div class="relative">
    <connection-status />

    <player-interface
      v-if="playerState"
      :name="name"
      :artist="artist"
      :cover="cover"
      :is-playing="playerState.isPlaying"
      :duration="playerState.duration"
      :played="playerState.currentPosition"
      @next="nextSong"
      @prev="prevSong"
      @toggle="toggle"
      @seek="seek({ time: $event })"
    />

    <local-player />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import PlayerInterface from "@/components/PlayerInterface.vue";
import ConnectionStatus from "@/components/ConnectionStatus.vue";
import LocalPlayer from "@/components/LocalPlayer.vue";
import { PlayerState } from "@/player/PlayerState";
import { Action, Getter } from "vuex-class";

@Component({
  components: { LocalPlayer, ConnectionStatus, PlayerInterface },
})
export default class Player extends Vue {
  @Getter("playerState") playerState?: PlayerState;

  @Action("seek") seek;
  @Action("toggle") toggle;
  @Action("nextSong") nextSong;
  @Action("prevSong") prevSong;

  get cover() {
    //TODO: rewrite this
    return (
      this.playerState?.song?.cover ??
      "http://www.scottishculture.org/themes/scottishculture/images/music_placeholder.png"
    );
  }

  get artist() {
    return this.playerState?.song?.artist ?? "";
  }

  get name() {
    return this.playerState?.song?.name ?? "";
  }
}
</script>
