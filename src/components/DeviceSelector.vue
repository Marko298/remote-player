<template>
  <div
    class="container mt-8 mx-auto bg-white shadow-2xl rounded-lg p-4"
    v-if="devices.length > 1"
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
        :selected="device.id === activeDeviceId"
        :value="device.id"
      >
        {{ device.name }}
      </option>
    </select>

    <fieldset class="mt-2" v-else>
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
              @click="switchToDevice(device.id)"
              :id="`device-selector-${device.id}`"
              :checked="device.id === activeDeviceId"
              class="focus:ring-0 h-4 w-4 text-orange cursor-pointer border-gray-300"
              name="device-selector"
              type="radio"
            />
          </div>
          <label
            class="ml-3 flex flex-col cursor-pointer"
            :for="`device-selector-${device.id}`"
          >
            <span class="block text-sm font-medium text-gray-900">
              {{ device.name }}
            </span>
          </label>
        </div>
      </div>
    </fieldset>
  </div>
</template>

<script lang="ts">
import { mapActions, mapState } from "vuex";

export default {
  name: "DeviceSelector",
  computed: mapState("remotePlayer", ["devices", "activeDeviceId"]),
  methods: mapActions("remotePlayer", ["switchToDevice"]),
};
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
