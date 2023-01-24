import { EventEmitter } from "https://deno.land/std@0.161.0/node/events.ts";

type Listener<K extends keyof WebSocketEventMap> = (args: WebSocketEventMap[K]) => void | Promise<void>;

class MyWebSocket extends EventEmitter {
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSING = 2;
  static CLOSED = 3;
  static encoding = 'json';
  static create(url: string) {
    return new MyWebSocket(url);
  }
  static pack = JSON.stringify
  static unpack(data: string | BufferSource) {
    const ab = new TextDecoder();
    if (typeof data !== 'string') {
      data = ab.decode(data);
    }
    return JSON.parse(data);
  }

  #listeners: {
    [K in keyof WebSocketEventMap]?: Listener<K>
  } = {};
  #socket: WebSocket
  constructor(url: string, protocols: string[] = []) {
    super()
    this.#socket = new WebSocket(url, protocols)

    this.on('open', args => this.#listeners.open?.(args));
    this.on('message', args => this.#listeners.message?.(args));
    this.on('error', args => this.#listeners.error?.(args));
    this.on('close', args => this.#listeners.close?.(args));
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
  terminate() {
    this.#socket.close()
  }

  set onopen(listener: Listener<'open'> | null) {
    this.#listeners.open = listener ?? undefined;
  }
  set onmessage(listener: Listener<'message'> | null) {
    this.#listeners.message = listener ?? undefined;
  }
  set onerror(listener: Listener<'error'> | null) {
    this.#listeners.error = listener ?? undefined;
  }
  set onclose(listener: Listener<'close'> | null) {
    this.#listeners.close = listener ?? undefined;
  }
}

export {
  MyWebSocket
}
