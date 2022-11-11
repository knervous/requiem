import { useContext, useMemo } from 'react';
import { ZoneContext } from '../../Zone/component';

export const useMq = () => {
  const { socket, selectedProcess } = useContext(ZoneContext);

  const mq = useMemo(() => {
    if (!socket || !selectedProcess?.pid) {
      return null;
    }
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
    };
  }, [socket, selectedProcess]);
 
  return mq;
};