import { Socket } from "socket.io-client";
import { myId } from "@/id";
import {
  CommandCallback,
  Device,
  PlayerState,
  RemoteCommand,
  RemoteCommandPayload,
  StateChangeCallback,
} from "@/player/PlayerState";

export interface SocketManager {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subscribe(eventName: string, handler: (...args: any[]) => void): void;

  unsubscribe(eventName: string): void;
}

export class RemotePlayerController {
  constructor(private socket: Socket, private manager: SocketManager) {}

  connect() {
    this.manager.subscribe("registered", () => {
      this.socket.emit("fetchState");
      this.socket.emit("fetchMaster");
      this.socket.emit("checkIfMaster");
    });

    this.socket.emit("announce", myId);
  }

  ready() {
    this.socket.emit("ready");
  }

  onStateChange(callback: StateChangeCallback, fetch = true) {
    this.manager.subscribe("stateChanged", callback);

    fetch && this.socket.emit("fetchState");
  }

  sendState(state: PlayerState) {
    this.socket.emit("stateChanged", state);
  }

  switchTo(id) {
    this.socket.emit("switchMaster", id);
  }

  onCommand(callback: CommandCallback) {
    this.manager.subscribe("command", function ({ command, payload }) {
      console.log(command, payload);
      callback(command, payload);
    });
  }

  command(command: RemoteCommand, payload: RemoteCommandPayload = {}) {
    this.socket.emit("command", {
      command,
      payload,
    });
  }

  onDeviceListChange(callback: (devices: Device[]) => void, fetch = true) {
    this.manager.subscribe("deviceListChanged", callback);

    fetch && this.socket.emit("fetchDevices");
  }

  onDeviceChange(callback: (device?: Device) => void, fetch = true) {
    this.manager.subscribe("masterChanged", callback);

    fetch && this.socket.emit("fetchMaster");
  }

  onBecameMaster(callback: (state?: PlayerState) => void, fetch = true) {
    this.manager.subscribe("nominatedAsMaster", callback);

    fetch && this.socket.emit("checkIfMaster");
  }
}
