import './App.css';
import Navbar from './components/Navbar/Navbar';
import {BrowserRouter as Router , Switch , Route} from 'react-router-dom'
import Home from './components/Home/Home';
import Chart from './components/Chart/Chart';
import DataTable from './components/DataTable/DataTable';

function App() {
  const NavRoute = ({path , component:Component , exact}) => {
    return (
      <Route exact={exact} path={path} >
        <Navbar />
        <Component />
      </Route>
    )
  }
  return (
    <Router>
      <div className="App">
        <Switch>
          <NavRoute exact path='/' component={Home}/>
          <NavRoute path='/charts' component={Chart} />
          <NavRoute path='/datatable' component={DataTable} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
