import { v4 } from 'uuid';


export class SocketHandler {
  #websocket;
  callbacks = {};
  get socket() {
    return this.#websocket;
  }
  close() {
    this.#websocket.close();
  }
  constructor(url) {
    this.#websocket = new WebSocket(url);
    this.connected = new Promise((res, rej) => {
      this.#websocket.onopen = res;
      this.#websocket.onerror = rej;
      setTimeout(rej, 2000);
    });
      
    this.#websocket.onclose = () => {
      console.log('Disconnected');
    };
  
    this.#websocket.onmessage = ({ data }) => {
      try {
        const deserialized = JSON.parse(data);
        if (typeof this.callbacks[deserialized.Type] === 'function') {
          this.callbacks[deserialized.Type](deserialized.Payload);
        }
      } catch (e) { 
        console.warn('Error receiving ws message', e, data);
      }
      
    };
  }
  on(message, callback) {
    this.callbacks[message] = callback;
  }
  once(message, callback) {
    this.callbacks[message] = async (...args) => {
      await callback(...args);
      delete this.callbacks[message];
    };
  }
  emit(message, payload, callback) {
    console.log('Emit', message, payload, callback);
    let callbackId;
    if (typeof callback === 'function') {
      const id = v4();
      this.once(id, callback);
      callbackId = id;
    }
    this.#websocket.send(JSON.stringify({ type: message, payload, callbackId }));
  }
}
  