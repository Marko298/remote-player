import { myId } from "@/id";
import {
  BecameMasterCallback,
  CommandCallback,
  Device,
  DeviceListChangeCallback,
  InitialState,
  MasterChangeCallback,
  PlayerState,
  RemoteCommand,
  RemoteCommandPayload,
  StateChangeCallback,
} from "@/player/RemotePlayer";
import { Socket } from "@/player/Socket";

export class RemotePlayerController {
  constructor(private socket: Socket) {}

  connect(): Promise<InitialState> {
    return new Promise((f) => {
      this.socket.subscribe("registered", ([devices, master, state]) =>
        f({
          devices,
          master,
          state,
        })
      );
      this.socket.emit("announce", myId);
    });
  }

  ready() {
    this.socket.emit("ready");
  }

  sendState(state: PlayerState) {
    this.socket.emit("stateChanged", state);
  }

  switchTo(id) {
    this.socket.emit("switchMaster", id);
  }

  confirmBecameMaster(state: PlayerState) {
    this.socket.emit("confirmMasterSwitch", state);
  }

  command(command: RemoteCommand, payload: RemoteCommandPayload = {}) {
    this.socket.emit("command", command, payload);
  }

  onStateChange(callback: StateChangeCallback) {
    this.socket.subscribe("stateChanged", callback);
  }

  onCommand(callback: CommandCallback) {
    this.socket.subscribe("command", ([command, payload]) =>
      callback(command, payload)
    );
  }

  onDeviceListChange(callback: DeviceListChangeCallback) {
    this.socket.subscribe("deviceListChanged", callback);
  }

  onMasterChange(callback: MasterChangeCallback) {
    this.socket.subscribe("masterChanged", ([master, state]) =>
      callback(master, state)
    );
  }

  onBecameMaster(callback: BecameMasterCallback) {
    this.socket.subscribe("nominatedAsMaster", callback);
  }
}
