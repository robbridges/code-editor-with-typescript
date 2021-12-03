import './text-editor.css';

import { useState, useEffect, useRef } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { Cell } from '../redux-state';
import { useActions } from '../hooks/use-actions';

interface EditorCellProp {
  cell: Cell
}

const TextEditor: React.FC<EditorCellProp> = ({cell}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [editing, setEditing] = useState(false);
  const { updateCell } = useActions();

  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (ref.current && event.target && ref.current.contains(event.target as Node)) {
        
        return;
      }
      
      setEditing(false);
    };
    document.addEventListener('click', listener, { capture: true});

    return () => {
      document.removeEventListener('click', listener, {capture: true});
    }
  }, []);
  
  

  if (editing) {
    return ( 
      <div className="text-editor" ref={ref}>
        <MDEditor value={cell.content} onChange={(updatedValue) => updateCell(cell.id, updatedValue || '') } />
      </div>
    )
  }

  return ( 
    <div className="text-editor card" onClick = {() => setEditing(true)}>
      <div className="card-content">
        <MDEditor.Markdown source ={cell.content || `Click to edit a code cell, or leave a message for yourself. You can see your work by calling the show function. For example show(1 + 1) will log to your console
      You can also import packages like React, give it a try by importing react then show(react)`} />
      </div>
    </div>  

  ) 
};

export default TextEditor;