import Login from './pages/Login';
import Lobby from './pages/Lobby';

function App() {
  return localStorage.getItem(process.env.REACT_APP_LS_ACCOUNTDATA!) ?
    <Lobby />
    :
    <Login />
}

export default App;
