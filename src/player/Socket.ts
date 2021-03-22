import { Socket as WebSocket } from "socket.io-client";
import {
  DefaultEventsMap,
  EventNames,
  EventParams,
} from "socket.io-client/build/typed-events";

export class Socket {
  constructor(private socket: WebSocket, private manager) {}

  public emit<Ev extends EventNames<DefaultEventsMap>>(
    ev: Ev,
    ...args: EventParams<DefaultEventsMap, Ev>
  ) {
    this.socket.emit(ev, ...args);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public subscribe(eventName: string, handler: (...args: any[]) => void) {
    this.manager.subscribe(eventName, handler);
  }

  public unsubscribe(eventName: string): void {
    this.manager.unsubscribe(eventName);
  }
}
