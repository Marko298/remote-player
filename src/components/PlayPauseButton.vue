<template>
  <svg
    v-on="$listeners"
    class="inline-block h-24 w-24 cursor-pointer mx-4 transform transition-transform active:scale-95"
    viewBox="0 0 85 85"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient
        x1="118.588967%"
        y1="-30.6928935%"
        x2="-9.20527766%"
        y2="107.785399%"
        id="linearGradient-1"
      >
        <stop stop-color="#B857E2" offset="0%"></stop>
        <stop stop-color="#FA6733" offset="100%"></stop>
      </linearGradient>
    </defs>
    <g
      v-if="playing"
      id="Page-1"
      stroke="none"
      stroke-width="1"
      fill="none"
      fill-rule="evenodd"
    >
      <g id="pause" fill-rule="nonzero">
        <circle
          id="Circle"
          fill="url(#linearGradient-1)"
          cx="42.5"
          cy="42.5"
          r="42.5"
        ></circle>
        <polygon
          id="Shape-path"
          stroke="#FFFFFF"
          fill="#FFFFFF"
          points="34 55 40 55 40 31 34 31"
        ></polygon>
        <polygon
          id="Shape-path"
          stroke="#FFFFFF"
          fill="#FFFFFF"
          points="46 55 52 55 52 31 46 31"
        ></polygon>
      </g>
    </g>

    <g v-else id="play" fill-rule="nonzero">
      <circle
        id="Circle"
        fill="url(#linearGradient-1)"
        cx="42.5"
        cy="42.5"
        r="42.5"
      ></circle>
      <path
        d="M33.2727563,31.2511271 C33.2727563,29.0449241 34.8018606,28.1845563 36.6952584,29.3337828 L55.5236741,40.7619754 C57.4138697,41.9092584 57.4170718,43.767428 55.5236741,44.9166545 L36.6952584,56.3448471 C34.8050627,57.49213 33.2727563,56.6346432 33.2727563,54.4275028 L33.2727563,31.2511271 Z"
        id="Play"
        fill="#FFFFFF"
      ></path>
    </g>
  </svg>
</template>

<script>
export default {
  name: "PlayPauseButton",
  props: {
    playing: {
      required: true,
      type: Boolean,
    },
  },
};
</script>
