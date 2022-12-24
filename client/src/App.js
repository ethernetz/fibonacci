import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import OtherPage from "./OtherPage";
import Fib from "./Fib";

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <div>Testing deployment</div>
          <Link to="/">Home</Link>
          <Link to="/otherpage">Other page</Link>
          <div>
            <Route exact path="/" component={Fib}></Route>
            <Route exact path="/otherpage" component={OtherPage}></Route>
          </div>
        </header>
      </div>
    </Router>
  );
}

export default App;
