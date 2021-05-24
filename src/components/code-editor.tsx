import { useRef } from 'react';
import MonacoEditor, { EditorDidMount } from '@monaco-editor/react';
import prettier from 'prettier';
import parser from 'prettier/parser-babel';

/*
This is our code editor, thankfully they have wrapped the entire set up editor
in a react component which we import. We are then giving it an interface so that 
typescript knows what values are being passed in. We are giving users an option 
the option to even format their code with prettier!
*/
interface CodeEditorProps {
  initalValue: string;
  onChange(value: string): void;

}

const CodeEditor: React.FC<CodeEditorProps> = ({ onChange, initalValue }) => {
  const editorRef = useRef<any>();
  
  const onEditorDidMount: EditorDidMount = (getValue, monacoEditor) => {
    editorRef.current = monacoEditor;
    monacoEditor.onDidChangeModelContent(() => {
      onChange(getValue());
    });

    monacoEditor.getModel()?.updateOptions({ tabSize: 2});
  };

  const onFormatClick = () => {
    const unformatted = editorRef.current.getModel().getValue();

    const formatted = prettier.format(unformatted, {
      parser: 'babel',
      plugins: [parser],
      useTabs: false,
      semi: true,
      singleQuote: true,
    })

    editorRef.current.setValue(formatted);
  };
  
  
  return (
    <div>
      <button onClick={onFormatClick}>Format</button>
   <MonacoEditor
    editorDidMount={onEditorDidMount}
    value= {initalValue}
    theme='dark' 
    language="javascript" 
    height="500px"
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