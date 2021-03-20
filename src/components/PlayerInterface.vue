<template>
  <div class="w-full">
    <div id="white-player">
      <div class="white-player-top">
        <div class="center">
          <span class="now-playing">Now Playing</span>
        </div>
      </div>

      <div id="white-player-center">
        <img
          :src="cover"
          data-amplitude-song-info="cover_art_url"
          class="main-album-art"
          alt="cover image"
        />

        <div class="song-meta-data">
          <span data-amplitude-song-info="name" class="song-name">
            {{ name }}
          </span>
          <span data-amplitude-song-info="artist" class="song-artist">
            {{ artist }}
          </span>
        </div>

        <div class="time-progress">
          <div id="progress-container">
            <label>
              <input
                :max="sliderSteps"
                type="range"
                class="amplitude-song-slider"
                :value="progress * sliderSteps"
                @input="rewinding"
                @change="rewind"
              />
            </label>
            <progress
              id="song-played-progress"
              class="amplitude-song-played-progress"
              :value="progress"
            ></progress>
            <progress
              id="song-buffered-progress"
              class="amplitude-buffered-progress"
              value="1"
            ></progress>
          </div>

          <div class="time-container">
            <span class="current-time">
              <span class="amplitude-current-minutes">{{
                playedMinutes | pad
              }}</span
              >:<span class="amplitude-current-seconds">{{
                playedSeconds | normalize | pad
              }}</span>
            </span>
            <span class="duration">
              <span class="amplitude-duration-minutes">{{
                durationMinutes | pad
              }}</span
              >:<span class="amplitude-duration-seconds">{{
                durationSeconds | normalize | pad
              }}</span>
            </span>
          </div>
        </div>
      </div>

      <div id="white-player-controls">
        <div
          class="transform transition-transform active:scale-95"
          id="previous"
          @click="$emit('prev')"
        ></div>
        <play-pause-button @click="$emit('toggle')" :playing="isPlaying" />
        <div
          class="transform transition-transform active:scale-95"
          id="next"
          @click="$emit('next')"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import PlayPauseButton from "@/components/PlayPauseButton";
export default {
  name: "PlayerInterface",
  components: { PlayPauseButton },
  data() {
    return {
      isRewinding: false,
      rewindPosition: 0,

      sliderSteps: 1000,
    };
  },

  props: {
    name: { required: true, type: String },
    artist: { required: true, type: String },
    cover: { required: true, type: String },
    duration: { required: true, type: Number },
    played: { required: true, type: Number },
    isPlaying: { required: true, type: Boolean },
  },

  emits: ["next", "prev", "toggle", "seek"],

  methods: {
    rewinding(event) {
      if (!this.isRewinding) {
        this.isRewinding = true;
      }

      this.rewindPosition = +event.target.value;
    },

    rewind() {
      this.isRewinding = false;
      this.$emit("seek", this.projectedPlayed);
    },
  },

  filters: {
    pad(value) {
      return String(value).length > 1 ? String(value) : "0" + value;
    },
    normalize(value) {
      return Math.round(value);
    },
  },

  computed: {
    projectedPlayed() {
      return (this.rewindPosition * this.duration) / this.sliderSteps;
    },
    playedComputed() {
      return this.isRewinding ? this.projectedPlayed : this.played;
    },
    durationSeconds() {
      return this.duration % 60;
    },
    durationMinutes() {
      return (this.duration - this.durationSeconds) / 60;
    },
    playedMinutes() {
      return (this.playedComputed - this.playedSeconds) / 60;
    },
    playedSeconds() {
      return this.playedComputed % 60;
    },
    progress() {
      return this.duration === 0 ? 0 : this.playedComputed / this.duration;
    },
  },
};
</script>

<style scoped>
div#white-player {
  width: 100%;
  max-width: 500px;
  background-color: #ffffff;
  box-shadow: 0px 12px 24px rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  font-family: "Lato", sans-serif;
  margin-left: auto;
  margin-right: auto;
  position: relative;
}

div.white-player-top {
  height: 64px;
  display: flex;
  width: 100%;
  align-items: center;
}

div.white-player-top div {
  flex: 1;
}

div.white-player-top div.center {
  text-align: center;
}

div.white-player-top span.now-playing {
  color: #414344;
  font-family: "Lato", sans-serif;
  line-height: 64px;
  font-weight: 600;
}

div#white-player-center img.main-album-art {
  display: block;
  margin: auto;
  margin-top: 16px;
  margin-bottom: 50px;
  border-radius: 8px;
  box-shadow: 0px 12px 24px rgba(0, 0, 0, 0.12);
  width: 280px;
  height: 280px;
}

div#white-player-center div.song-meta-data span.song-name {
  color: #414344;
  display: block;
  text-align: center;
  font-size: 20px;
}

div#white-player-center div.song-meta-data span.song-artist {
  color: #aaafb3;
  display: block;
  text-align: center;
  font-size: 14px;
}

div#white-player-center div.time-progress {
  margin-bottom: 30px;
}

div#white-player-center div.time-progress span.current-time {
  color: #aaafb3;
  font-size: 12px;
  display: block;
  float: left;
  margin-left: 20px;
}

div#white-player-center div.time-progress div#progress-container {
  margin-left: 20px;
  margin-right: 20px;
  position: relative;
  height: 20px;
  cursor: pointer;
  /*
    IE 11
  */
}

div#white-player-center
  div.time-progress
  div#progress-container:hover
  input[type="range"].amplitude-song-slider::-webkit-slider-thumb {
  display: block;
}

div#white-player-center
  div.time-progress
  div#progress-container:hover
  input[type="range"].amplitude-song-slider::-moz-range-thumb {
  visibility: visible;
}

div#white-player-center
  div.time-progress
  div#progress-container
  progress#song-played-progress {
  width: 100%;
  position: absolute;
  left: 0;
  top: 8px;
  right: 0;
  z-index: 60;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  height: 4px;
  border-radius: 5px;
  background: transparent;
  border: none;
  /* Needed for Firefox */
}

@media all and (-ms-high-contrast: none) {
  div#white-player-center
    div.time-progress
    div#progress-container
    *::-ms-backdrop,
  div#white-player-center
    div.time-progress
    div#progress-container
    progress#song-played-progress {
    color: #fa6733;
    border: none;
    background-color: #e1e1e1;
  }
}

@supports (-ms-ime-align: auto) {
  div#white-player-center
    div.time-progress
    div#progress-container
    progress#song-played-progress {
    color: #fa6733;
    border: none;
  }
}

div#white-player-center
  div.time-progress
  div#progress-container
  progress#song-played-progress[value]::-webkit-progress-bar {
  background: none;
  border-radius: 5px;
}

div#white-player-center
  div.time-progress
  div#progress-container
  progress#song-played-progress[value]::-webkit-progress-value {
  background-color: #fa6733;
  border-radius: 5px;
}

div#white-player-center
  div.time-progress
  div#progress-container
  progress#song-played-progress::-moz-progress-bar {
  background: none;
  border-radius: 5px;
  background-color: #fa6733;
  height: 5px;
  margin-top: -2px;
}

div#white-player-center
  div.time-progress
  div#progress-container
  progress#song-buffered-progress {
  position: absolute;
  left: 0;
  top: 8px;
  right: 0;
  width: 100%;
  z-index: 10;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  height: 4px;
  border-radius: 5px;
  background: transparent;
  border: none;
  background-color: #d7dee3;
}

div#white-player-center
  div.time-progress
  div#progress-container
  progress#song-buffered-progress[value]::-webkit-progress-bar {
  background-color: #e1e1e1;
  border-radius: 5px;
}

div#white-player-center
  div.time-progress
  div#progress-container
  progress#song-buffered-progress[value]::-webkit-progress-value {
  background-color: #e1e1e1;
  border-radius: 5px;
  transition: width 0.1s ease;
}

div#white-player-center
  div.time-progress
  div#progress-container
  progress#song-buffered-progress::-moz-progress-bar {
  background: none;
  border-radius: 5px;
  background-color: #e1e1e1;
  height: 5px;
  margin-top: -2px;
}

div#white-player-center
  div.time-progress
  div#progress-container
  progress::-ms-fill {
  border: none;
}

@-moz-document url-prefix() {
  div#white-player-center
    div.time-progress
    div#progress-container
    progress#song-buffered-progress {
    top: 9px;
    border: none;
  }
}

@media all and (-ms-high-contrast: none) {
  div#white-player-center
    div.time-progress
    div#progress-container
    *::-ms-backdrop,
  div#white-player-center
    div.time-progress
    div#progress-container
    progress#song-buffered-progress {
    color: #78909c;
    border: none;
  }
}

@supports (-ms-ime-align: auto) {
  div#white-player-center
    div.time-progress
    div#progress-container
    progress#song-buffered-progress {
    color: #78909c;
    border: none;
  }
}

div#white-player-center
  div.time-progress
  div#progress-container
  input[type="range"] {
  -webkit-appearance: none;
  width: 100%;
  margin: 7.5px 0;
  position: absolute;
  z-index: 9999;
  top: -7px;
  height: 20px;
  cursor: pointer;
  background-color: inherit;
}

div#white-player-center
  div.time-progress
  div#progress-container
  input[type="range"]:focus {
  outline: none;
}

div#white-player-center
  div.time-progress
  div#progress-container
  input[type="range"]::-webkit-slider-runnable-track {
  width: 100%;
  height: 0px;
  cursor: pointer;
  box-shadow: 0px 0px 0px rgba(0, 0, 0, 0), 0px 0px 0px rgba(13, 13, 13, 0);
  background: #fa6733;
  border-radius: 0px;
  border: 0px solid #010101;
}

div#white-player-center
  div.time-progress
  div#progress-container
  input[type="range"]::-webkit-slider-thumb {
  box-shadow: 0px 0px 0px #000000, 0px 0px 0px #0d0d0d;
  border: 1px solid #fa6733;
  height: 15px;
  width: 15px;
  border-radius: 16px;
  background: #fa6733;
  cursor: pointer;
  -webkit-appearance: none;
  margin-top: -7.5px;
}

div#white-player-center
  div.time-progress
  div#progress-container
  input[type="range"]:focus::-webkit-slider-runnable-track {
  background: #fa6733;
}

div#white-player-center
  div.time-progress
  div#progress-container
  input[type="range"]::-moz-range-track {
  width: 100%;
  height: 0px;
  cursor: pointer;
  box-shadow: 0px 0px 0px rgba(0, 0, 0, 0), 0px 0px 0px rgba(13, 13, 13, 0);
  background: #fa6733;
  border-radius: 0px;
  border: 0px solid #010101;
}

div#white-player-center
  div.time-progress
  div#progress-container
  input[type="range"]::-moz-range-thumb {
  box-shadow: 0px 0px 0px #000000, 0px 0px 0px #0d0d0d;
  border: 1px solid #fa6733;
  height: 15px;
  width: 15px;
  border-radius: 16px;
  background: #fa6733;
  cursor: pointer;
}

div#white-player-center
  div.time-progress
  div#progress-container
  input[type="range"]::-ms-track {
  width: 100%;
  height: 0px;
  cursor: pointer;
  background: transparent;
  border-color: transparent;
  color: transparent;
}

div#white-player-center
  div.time-progress
  div#progress-container
  input[type="range"]::-ms-fill-lower {
  background: #003d57;
  border: 0px solid #010101;
  border-radius: 0px;
  box-shadow: 0px 0px 0px rgba(0, 0, 0, 0), 0px 0px 0px rgba(13, 13, 13, 0);
}

div#white-player-center
  div.time-progress
  div#progress-container
  input[type="range"]::-ms-fill-upper {
  background: #fa6733;
  border: 0px solid #010101;
  border-radius: 0px;
  box-shadow: 0px 0px 0px rgba(0, 0, 0, 0), 0px 0px 0px rgba(13, 13, 13, 0);
}

div#white-player-center
  div.time-progress
  div#progress-container
  input[type="range"]::-ms-thumb {
  box-shadow: 0px 0px 0px #000000, 0px 0px 0px #0d0d0d;
  border: 1px solid #fa6733;
  height: 15px;
  width: 15px;
  border-radius: 16px;
  background: #fa6733;
  cursor: pointer;
  height: 0px;
  display: none;
}

@media all and (-ms-high-contrast: none) {
  div#white-player-center
    div.time-progress
    div#progress-container
    *::-ms-backdrop,
  div#white-player-center
    div.time-progress
    div#progress-container
    input[type="range"].amplitude-song-slider {
    padding: 0px;
  }

  div#white-player-center
    div.time-progress
    div#progress-container
    *::-ms-backdrop,
  div#white-player-center
    div.time-progress
    div#progress-container
    input[type="range"].amplitude-song-slider::-ms-thumb {
    height: 15px;
    width: 15px;
    border-radius: 10px;
    cursor: pointer;
    margin-top: -8px;
  }

  div#white-player-center
    div.time-progress
    div#progress-container
    *::-ms-backdrop,
  div#white-player-center
    div.time-progress
    div#progress-container
    input[type="range"].amplitude-song-slider::-ms-track {
    border-width: 15px 0;
    border-color: transparent;
  }

  div#white-player-center
    div.time-progress
    div#progress-container
    *::-ms-backdrop,
  div#white-player-center
    div.time-progress
    div#progress-container
    input[type="range"].amplitude-song-slider::-ms-fill-lower {
    background: #e1e1e1;
    border-radius: 10px;
  }

  div#white-player-center
    div.time-progress
    div#progress-container
    *::-ms-backdrop,
  div#white-player-center
    div.time-progress
    div#progress-container
    input[type="range"].amplitude-song-slider::-ms-fill-upper {
    background: #e1e1e1;
    border-radius: 10px;
  }
}

@supports (-ms-ime-align: auto) {
  div#white-player-center
    div.time-progress
    div#progress-container
    input[type="range"].amplitude-song-slider::-ms-thumb {
    height: 15px;
    width: 15px;
    margin-top: 3px;
  }
}

div#white-player-center
  div.time-progress
  div#progress-container
  input[type="range"]:focus::-ms-fill-lower {
  background: #fa6733;
}

div#white-player-center
  div.time-progress
  div#progress-container
  input[type="range"]:focus::-ms-fill-upper {
  background: #fa6733;
}

div#white-player-center div.time-progress span.duration {
  color: #aaafb3;
  font-size: 12px;
  display: block;
  float: right;
  margin-right: 20px;
}

div#white-player-controls {
  text-align: center;
  padding-bottom: 35px;
}

div#white-player-controls #previous {
  display: inline-block;
  height: 53px;
  width: 53px;
  cursor: pointer;
  background: url("https://521dimensions.com/img/open-source/amplitudejs/examples/dynamic-songs/previous.svg");
  vertical-align: middle;
}

div#white-player-controls div#next {
  display: inline-block;
  height: 53px;
  width: 53px;
  cursor: pointer;
  background: url("https://521dimensions.com/img/open-source/amplitudejs/examples/dynamic-songs/next.svg");
  vertical-align: middle;
}

div.song-to-add img {
  border-radius: 6px;
  margin-top: 50px;
  width: 100%;
}
</style>
