<template>
  <div class="container mt-8 mx-auto bg-white shadow-2xl rounded-lg p-4">
    <label class="block text-sm font-medium text-gray-700" for="device">
      Device
    </label>
    <select
      id="device"
      class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
      name="device"
      @change="changeDevice"
    >
      <option
        v-for="device in devices"
        :key="device.id"
        :selected="device.id === activeDeviceId"
        :value="device.id"
      >
        {{ device.name }}
      </option>
    </select>
  </div>
</template>

<script lang="ts">
import { mapActions, mapState } from "vuex";

export default {
  name: "DeviceSelector",
  computed: mapState("remotePlayer", ["devices", "activeDeviceId"]),

  methods: {
    ...mapActions("remotePlayer", ["switchToDevice"]),
    changeDevice(e) {
      this.switchToDevice(e.target.value);
    },
  },
};
</script>
