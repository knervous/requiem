import * as React from 'react';
import { createContext, useState, useEffect, useCallback } from 'react';
import { v4 } from 'uuid';


export const MacroContext = createContext({});

const defaultJs = `
/** @type {MQGlobal} */
const mq = require('./macros/mq');

// Use Debugger
// Open chrome://inspect to debug. Don't forget to add remote target for network debugging.
mq.util.useDebugger(9339);

// Main Loop
mq.util.main(async () => {
  
  // Sleep for 1 second
  await mq.util.sleep(1000);

  // Any command
  mq.run('sit');
})

mq.listeners.addChatListener(line => {
  // We got a chat event!
})

mq.listeners.addSpawnListener(spawn => {
  // We got a spawn event!
  mq.log(\`A mob spawned! \${spawn.displayedName}\`);
})
`;
const getNewMacro = (name = 'New Macro', text = defaultJs,) => ({
  id: v4(),
  text,
  name
});

export const MacroProvider = ({ children }) => {
  const [macros, setMacros] = useState(
    JSON.parse(localStorage.getItem('macros') ?? '[]'),
  );

  const [editorOpen, setEditorOpen] = useState(false);
  const openEditor = useCallback(() => setEditorOpen(true), []);
  const closeEditor = useCallback(() => setEditorOpen(false), []);

  const [editingMacro, setEditingMacro] = useState(null);
  
  const addMacro = useCallback(() => {
    setMacros(macros => [...macros, getNewMacro()]);
  }, []);

  const uploadMacro = useCallback((name, text) => {
    setMacros(macros => [...macros, getNewMacro(name, text)]);
  }, []);

  const deleteMacro = useCallback(id => {
    setMacros(macros => [...macros].filter(m => m.id !== id));
  }, []);

  const updateMacro = useCallback(macro => {
    setMacros(macros => {
      const idx = macros.findIndex(m => m.id === macro.id);
      if (idx !== -1) {
        macros[idx] = macro;
      }
      return [...macros];
    });
  }, []); 

  useEffect(() => {
    localStorage.setItem('macros', JSON.stringify(macros));
  }, [macros]);

  return (
    <MacroContext.Provider
      value={{
        addMacro,
        deleteMacro,
        updateMacro,
        uploadMacro,
        macros,
        openEditor,
        closeEditor,
        editorOpen,
        editingMacro, 
        setEditingMacro
      }}
    >
      {children}
    </MacroContext.Provider>
  );
};
