import './code-editor-styles.css';
import { useRef } from 'react';
import MonacoEditor, { EditorDidMount } from '@monaco-editor/react';
import prettier from 'prettier';
import parser from 'prettier/parser-babel';

/*
This is our code editor, thankfully they have wrapped the entire set up editor
in a react component which we import. We are then giving it an interface so that 
typescript knows what values are being passed in. We are even giving users an option 
the option to even format their code with prettier via the format button
*/
interface CodeEditorProps {
  initialValue: string;
  onChange(value: string): void;

}

const CodeEditor: React.FC<CodeEditorProps> = ({ onChange, initialValue }) => {
  const editorRef = useRef<any>();
  
  const onEditorDidMount: EditorDidMount = (getValue, MonacoEditor) => {
    editorRef.current = MonacoEditor;
    MonacoEditor.onDidChangeModelContent(() => {
      onChange(getValue());
    });

    MonacoEditor.getModel()?.updateOptions({ tabSize: 2});
  };

  const onFormatClick = () => {
    // get current value from editor
    const unformatted = editorRef.current.getModel().getValue();

    // format that value with specific rules from prettier
    const formatted = prettier.format(unformatted, {
      parser: 'babel',
      plugins: [parser],
      useTabs: false,
      semi: true,
      singleQuote: true,
    }).replace(/\n$/, '');

    // set the formatted value back in the editor
    editorRef.current.setValue(formatted);
  };
  
  // return the code editor below with all of the optional rules and settings. Yay dark mode!
  return (
    <div className="editor-wrapper">
      <button className="button button-format is-primary is-small" 
      onClick={onFormatClick}>Format</button>
      <MonacoEditor
        editorDidMount={onEditorDidMount}
        value={initialValue}
        theme="dark"
        language="javascript"
        height="100%"      
        options={{
          wordWrap: 'on',
          minimap: { enabled: false },
          showUnused: false,
          folding: false,
          lineNumbersMinChars: 3,
          fontSize: 16,
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  );
};

export default CodeEditor;