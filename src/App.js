import logo from './logo.svg';
//import './App.css';
import Main from './components/Main';

import moment from 'moment';
import 'moment/locale/fr';

moment.locale('fr')

function App() {
  return (
    <div className="App">
        <Main />
    </div>
  );
}

export default App;
