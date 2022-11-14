import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import Draggable from 'react-draggable';

import Editor, { loader } from '@monaco-editor/react';
import Mq from '!raw-loader!../../../common/mq.d.ts' // eslint-disable-line

import './component.scss';
import { MacroContext } from '../../Context/macroContext';
import { useCallback } from 'react';

loader.init().then((monaco) => {
  monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: true,
    noSyntaxValidation  : false,
  });
  monaco.languages.typescript.javascriptDefaults.addExtraLib(
    Mq,
    'filename/mq.d.ts',
  );
  monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
    target              : monaco.languages.typescript.ScriptTarget.ES2015,
    allowNonTsExtensions: true,
    allowJs             : true,
  });
  monaco.editor.createModel(
    Mq,
    'typescript',
    monaco.Uri.parse('filename/mq.d.ts'),
  );
});

export const MacroEditorDialog = ({ PaperComponent }) => {
  const contentRef = useRef(null);

  const { editorOpen, closeEditor, editingMacro, updateMacro } = useContext(
    MacroContext,
  );
  const [macroName, setMacroName] = useState(editingMacro?.name);
  const [macroText, setMacroText] = useState(editingMacro?.allowNonTsExtensions);

  useEffect(() => {
    setMacroName(editingMacro?.name);
    setMacroText(editingMacro?.text);
  }, [editingMacro]);

  const saveAndClose = useCallback(() => {
    updateMacro({ ...editingMacro, name: macroName, text: macroText });
    closeEditor();
  }, [editingMacro, macroName, macroText, updateMacro, closeEditor]);

  const handleEditorChange = useCallback((value) => {
    setMacroText(value);
  }, []);

  const handleClose = (event, reason) => {
    if (reason && reason === 'backdropClick') {
      return;
    }
    closeEditor(false);
  };
  return editorOpen && editingMacro ? (
    <Draggable handle=".draggable" cancel={'[class*="MuiDialogContent-root"]'}>
      <Dialog
        fullWidth
        BackdropProps={{ style: { backgroundColor: 'transparent' } }}
        maxWidth="md"
        style={{ cursor: 'move', zIndex: 10001 }}
        className="macro-editor"
        open={editorOpen}
        clo
        onKeyDown={(e) => e.stopPropagation()}
        onClose={handleClose}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle
          className="macro-editor-title draggable"
          id="draggable-dialog-title"
        >
          <TextField
            onMouseDown={(e) => e.stopPropagation()}
            label="Name"
            variant="outlined"
            defaultValue={macroName}
            value={macroName}
            onChange={(e) => setMacroName(e.target.value)}
          />
        </DialogTitle>
        <DialogContent ref={contentRef}>
          <Editor
            language="javascript"
            className="macro-editor-monaco"
            height={contentRef?.current?.clientHeight}
            theme="vs-dark"
            defaultLanguage="javascript"
            defaultValue={editingMacro.text}
            onChange={handleEditorChange}
          />
        </DialogContent>
        <DialogActions className="macro-editor-buttons draggable">
          <Button autoFocus onClick={() => closeEditor(false)}>
            Cancel
          </Button>
          <Button autoFocus onClick={saveAndClose}>
            Save and Close
          </Button>
        </DialogActions>
      </Dialog>
    </Draggable>
  ) : null;
};
