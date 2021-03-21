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
  private stateChangeCallback?: StateChangeCallback;

  constructor(
    // private state: PlayerState,
    private socket: Socket,
    private manager: SocketManager
  ) {
    this.subscribeToUpdates();
  }

  static async prepare(socket: Socket, manager: SocketManager) {
    return new Promise((f) => {
      socket.emit("announce", myId);

      manager.subscribe("registered", () => {
        f(new RemotePlayerController(socket, manager));
      });
    });
  }

  onStateChange(callback?: StateChangeCallback, fetch = true) {
    this.stateChangeCallback = callback;
    fetch && this.socket.emit("fetchState");
  }

  // getState(): PlayerState {
  //   return this.state;
  // }

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

  private subscribeToUpdates() {
    this.manager.subscribe("stateChanged", (state: PlayerState) => {
      // this.state = state;
      this.stateChangeCallback && this.stateChangeCallback(state);
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
}
