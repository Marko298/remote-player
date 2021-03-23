import { Device } from "@/player/RemotePlayer";

function prettifyThisDevice(device: Device): Device {
  return {
    ...device,
    name: device.name + " (you)", //
  };
}

export function prettifyDeviceList(devices: Device[], myId: string): Device[] {
  return devices
    .sort((d) => (d.id === myId ? -1 : 1)) //This device must come first
    .map((d) => (d.id === myId ? prettifyThisDevice(d) : d));
}
