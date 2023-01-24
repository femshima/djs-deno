import { EventEmitter } from "https://deno.land/std@0.161.0/node/events.ts";

type Listener<K extends keyof WebSocketEventMap> = (args: WebSocketEventMap[K]) => void | Promise<void>;

class MyWebSocket extends EventEmitter {
  #socket: WebSocket
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSING = 2;
  static CLOSED = 3;
  static create(url: string) {
    return new MyWebSocket(url);
  }
  static unpack(data: string | BufferSource) {
    const ab = new TextDecoder();
    if (typeof data !== 'string') {
      data = ab.decode(data);
    }
    return JSON.parse(data);
  }
  static pack = JSON.stringify

  constructor(url: string, protocols: string[] = []) {
    super()
    this.#socket = new WebSocket(url, protocols)
  }
  override on<K extends keyof WebSocketEventMap>(event: K, listener: Listener<K>): this {
    super.on(event, listener)
    this.#socket.addEventListener(event, (ev) => {
      super.emit(event, ev)
    })
    return this
  }
  get readyState(): number {
    return this.#socket.readyState
  }
  send(content: string | ArrayBufferLike | Blob | ArrayBufferView) {
    return this.#socket.send(content)
  }
  close(code?: number, reason?: string) {
    return this.#socket.close(code, reason)
  }

  set onopen(listener: Listener<'open'>) {
    this.on("open",listener);
  }
  set onmessage(listener: Listener<'message'>) {
    this.on("message",listener);
  }
  set onerror(listener: Listener<'error'>) {
    this.on("error",listener);
  }
  set onclose(listener: Listener<'close'>) {
    this.on("close", listener);
  }
}

export {
  MyWebSocket
}
