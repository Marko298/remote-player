<template>
  <div class="relative">
    <connection-status />

    <player-interface
      v-if="playerState"
      :name="playerState.song.name"
      :artist="playerState.song.artist"
      :is-playing="playerState.isPlaying"
      :duration="playerState.duration"
      :played="playerState.currentPosition"
      :cover="playerState.song.cover"
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
}
</script>
