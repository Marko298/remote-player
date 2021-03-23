<template>
  <div
    v-if="devices && devices.length > 1"
    class="container mt-8 mx-auto bg-white shadow-2xl rounded-lg p-4 select-none"
  >
    <label class="block text-sm font-medium text-gray-700" for="device">
      Play from
    </label>

    <select
      v-if="false"
      id="device"
      class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
      name="device"
      @change="switchToDevice($event.target.value)"
    >
      <option
        v-for="device in devices"
        :key="device.id"
        :disabled="!device.ready"
        :selected="device.id === activeDeviceId"
        :value="device.id"
      >
        {{ device.name }}
      </option>
    </select>

    <fieldset v-else class="mt-2">
      <legend class="sr-only">Playing device</legend>

      <div class="bg-white rounded-md">
        <div
          v-for="device in devices"
          :key="device.id"
          :value="device.id"
          class="relative py-2 flex z-10 border-gray-200"
        >
          <div class="flex items-center h-5">
            <input
              :id="`device-selector-${device.id}`"
              :checked="device.id === activeDeviceId"
              :class="{ 'cursor-pointer': device.ready }"
              :disabled="!device.ready"
              class="focus:ring-0 h-4 w-4 text-orange border-gray-300"
              name="device-selector"
              type="radio"
              @click="switchToDevice(device.id)"
            />
          </div>
          <label
            :class="{ 'cursor-pointer': device.ready }"
            :for="`device-selector-${device.id}`"
            class="ml-3 flex flex-col"
          >
            <span
              :class="{
                'text-gray-900': device.ready,
                'text-gray-400': !device.ready,
              }"
              class="block text-sm font-medium"
            >
              {{ device.name }}
            </span>
          </label>
        </div>
      </div>
    </fieldset>

    <span class="text-gray-500 text-sm font-medium" v-if="!isLocalReady">
      Hint: Tap anywhere to activate this device
    </span>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Device } from "@/player/RemotePlayer";
import { namespace } from "vuex-class";

const remotePlayer = namespace("remotePlayer");
const localPlayer = namespace("localPlayer");

@Component({})
export default class DeviceSelector extends Vue {
  @remotePlayer.Action("switchToDevice") switchToDevice!: (id: string) => void;
  @remotePlayer.State("devices") devices: Device[];
  @remotePlayer.State("activeDeviceId") activeDeviceId?: string;

  @localPlayer.State("isReady") isLocalReady: boolean;
}
</script>

<style>
/*.text-gradient {*/
/*  !*-webkit-*!*/
/*  background: linear-gradient(-134deg, #c182dc 0%, #fb7c62 94%, #ff7c5b 100%);*/
/*  -webkit-background-clip: text;*/
/*  -webkit-text-fill-color: transparent;*/
/*}*/

.text-orange {
  color: #f06450 !important;
}
</style>
