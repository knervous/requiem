import { EQPacket } from '../packet/EQPacket';

function base64ToArrayBuffer(base64) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

export class EqSocket {
  /**
   * @type {WebTransport}
   */
  webtransport = null;
  isConnected = false;

  async send (buffer) {
    try {
      if (this.webtransport !== null) {
        const writer = this.webtransport.datagrams.writable.getWriter();
        //      await writer.ready;
        writer.write(
          buffer instanceof EQPacket ? buffer.getBuffer() : buffer
        );
        writer.releaseLock();
      } else {
        console.error('Sending from an unopen socket');
      }
    } catch (e) {
      console.error(e);
    }
   
  }
  close () {
    if (this.webtransport) {
      console.log('Closing WebTransport', this.webtransport);
      this.webtransport.close();
      this.webtransport = null;
    }
  }

  async connect (port, onMessage, onClose) {
    const WebTransport = window.WebTransport;
    if (!WebTransport) {
      return false;
    }
    console.log(`Connecting via WebTransport to: ${port}`);
    if (this.webtransport !== null && !(await this.webtransport.closed)) {
      this.webtransport.close();
      this.webtransport = null;
    }
    this.webtransport = new WebTransport(`https://${process.env.REACT_APP_EQ_SERVER}:${port}/eq`, {
      serverCertificateHashes: [
        {
          algorithm: 'sha-256',
          value    : base64ToArrayBuffer('UJmQrrDia/3IO7e40AFnJ+EWP1ZRVcgkAP/m5kCuiok=')
        }
      ]
    });
    await this.webtransport.ready;
    (async () => {
      const reader = this.webtransport.datagrams.readable.getReader();
    
      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          onClose();
          break;
        }
        const opcode = new Uint16Array(value.buffer)[0];
        onMessage(opcode, value.slice(2, value.length));
      }
    })();

    
  }
}
