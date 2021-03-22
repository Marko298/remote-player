import { myId } from "@/id";
import {
  CommandCallback,
  Device,
  PlayerState,
  RemoteCommand,
  RemoteCommandPayload,
  StateChangeCallback,
} from "@/player/PlayerState";
import { Socket } from "@/player/Socket";

export class RemotePlayerController {
  constructor(private socket: Socket) {}

  connect() {
    this.socket.subscribe("registered", () => {
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
    this.socket.subscribe("stateChanged", callback);

    fetch && this.socket.emit("fetchState");
  }

  sendState(state: PlayerState) {
    this.socket.emit("stateChanged", state);
  }

  switchTo(id) {
    this.socket.emit("switchMaster", id);
  }

  onCommand(callback: CommandCallback) {
    this.socket.subscribe("command", function ({ command, payload }) {
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
    this.socket.subscribe("deviceListChanged", callback);

    fetch && this.socket.emit("fetchDevices");
  }

  onDeviceChange(
    callback: (master?: string, state?: PlayerState) => void,
    fetch = true
  ) {
    this.socket.subscribe("masterChanged", ({ master, state }) =>
      callback(master, state)
    );

    fetch && this.socket.emit("fetchMaster");
  }

  onBecameMaster(callback: (state?: PlayerState) => void, fetch = true) {
    this.socket.subscribe("nominatedAsMaster", callback);

    fetch && this.socket.emit("checkIfMaster");
  }
}
