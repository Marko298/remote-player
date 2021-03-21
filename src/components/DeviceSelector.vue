<template>
  <div class="container mt-8 mx-auto bg-white shadow-2xl rounded-lg p-4">
    <label for="device" class="block text-sm font-medium text-gray-700">
      Device
    </label>
    <select
      id="device"
      name="device"
      @change="changeDevice"
      class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
    >
      <option
        v-for="device in devices"
        :value="device.id"
        :key="device.id"
        :selected="device.id === activeDeviceId"
      >
        {{ device.name }}
      </option>
    </select>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ConnectionStatus from "@/components/ConnectionStatus.vue";
import Player from "@/components/PlayerInterface.vue";
import { Action, State } from "vuex-class";

@Component({
  components: { DeviceSelector, Player, ConnectionStatus },
})
export default class DeviceSelector extends Vue {
  @State("remotePlayer/devices") devices;
  @State("remotePlayer/activeDeviceId") activeDeviceId;
  @Action("remotePlayer/switchToDevice") switchDevice;

  changeDevice(e) {
    this.switchDevice(+e.target.value);
  }
}
</script>
