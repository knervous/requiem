import { useContext, useMemo } from 'react';
import { ZoneContext } from '../../Zone/component';


import Editor from '@monaco-editor/react';

/**
 * @typedef Macroquest
 * @property {import('./mq').MacroQuest.TopLevelObjects} tlo
*/

class ExtensibleFunction extends Function {
  constructor(t) {
    return Object.setPrototypeOf(t, new.target.prototype);
  }
}
class MqProxy extends ExtensibleFunction {
  static socketAction = () => {};
  constructor(t = []) {
    return (
      super((t) =>
        void 0 !== t
          ? ((this.path[this.path.length - 1] += `[${t}]`),
          new MqProxy(this.path))
          : MqProxy.socketAction(this.path.join('.'))
      ),
      (this.path = t),
      new Proxy(this, {
        get: (t, e) => new MqProxy(this.path.concat(e.toString())),
      })
    );
  }
}


export const useMq = () => {
  const { socket, selectedProcess } = useContext(ZoneContext);


  /** @type {Macroquest} */
  const mq = useMemo(() => {
    if (!socket || !selectedProcess?.pid) {
      return null;
    }
    MqProxy.socketAction = evalString => new Promise(res => socket.emit('doAction', {
      processId: selectedProcess.pid,
      payload  : {
        eval: evalString
      },
      type: 'eval',
    }, val => {
      if (val === 'NULL') {
        res(null);
      }
      if (val === 'TRUE') {
        res(true);
      }
      if (val === 'FALSE') {
        res(false);
      }
      if (!isNaN(val)) {
        res(+val);
      }
      res(val);
    }));
    return {
      doCommand(command) {
        socket.emit('doAction', {
          processId: selectedProcess.pid,
          payload  : {
            command
          },
          type: 'command',
        });
      },
      doMacro(macro) {
        socket.emit('doAction', {
          processId: selectedProcess.pid,
          payload  : {
            macro
          },
          type: 'macro',
        });
      },
      tlo: new MqProxy(),
      Editor
    };
  }, [socket, selectedProcess]);
  window.mq = mq;
  return mq;
};