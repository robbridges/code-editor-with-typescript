import ReactDOM from 'react-dom';
import App from './app'

import {Provider} from 'react-redux';
import {store} from './redux-state';

ReactDOM.render(
  
  <App />,
  document.querySelector('#root')
);

export default App;