import { EQPacket } from '../packet/EQPacket';

const fetchedPaths = [];

export class EqSocket {
  /**
   * @type {WebSocket}
   */
  websock = null;

  send (buffer) {
    if (this.websock !== null && this.websock.readyState !== WebSocket.CLOSED) {
      this.websock.send(
        buffer instanceof EQPacket ? buffer.getBuffer() : buffer
      );
    } else {
      console.error('Sending from an unopen socket');
    }
  }
  close () {
    this.websock?.close();
  }
  connect (port, onMessage, onClose) {
    console.log(`Connecting to: ${port}`);
    if (this.websock !== null && this.websock.readyState !== WebSocket.CLOSED) {
      this.websock.close();
    }

    this.websock = new WebSocket(`ws://${process.env.REACT_APP_EQ_SERVER}:${port}`);
    this.websock.binaryType = 'arraybuffer';
    const self = this;
    return new Promise((res, rej) => {
      this.websock.onerror = function (event) {
        console.error('Error connecting to server', event, port);
        setTimeout(1500, () => {
          console.log('Attempting reconnect', port);
          this.connect(port, onMessage, onClose);
        });
      };

      this.websock.onclose = function (event) {
        onClose(event);
        setTimeout(1500, () => {
          console.log('Attempting reconnect', port);
          this.connect(port, onMessage, onClose);
        });
      };

      this.websock.onmessage = function (event) {
        self._messageHandler?.(event);
        onMessage(event.data);
      };

      this.websock.onopen = function (_event) {
        res();
      };
    });
  }
}
