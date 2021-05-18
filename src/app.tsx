import { useState } from 'react';

const App = () => {
  const [input, setInput] =useState('Enter Text Here');
  const [code, setCode]= useState('');

  const onClick = () => {
    console.log(input);
  }

  return (
  <div>
    <textarea onChange={e => setInput(e.target.value) } value={input}></textarea>
    <div>
      <button onClick={onClick}>Submit</button>
    </div>
    <pre>{code}</pre>
  </div>
    )
}

export default App;