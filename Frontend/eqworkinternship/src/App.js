import './App.css';
import Navbar from './components/Navbar/Navbar';
import {BrowserRouter as Router , Switch , Route} from 'react-router-dom'
import Home from './components/Home/Home';
import Chart from './components/Chart/Chart';
import DataTable from './components/DataTable/DataTable';
import Maps from './components/Maps/Maps';
import Error404 from './components/Errors/Error404';
import Error429 from './components/Errors/Error429';

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
          <NavRoute path='/charts'  component={Chart} />
          <NavRoute path='/charts#loaded' component={Chart} />
          <NavRoute exact path='/datatable' component={DataTable} />
          <NavRoute exact path='/map' component={Maps} />
          <Route path='/toomanyrequests' component={Error429} />
          <Route component={Error404} />
          
        </Switch>
      </div>
    </Router>
  );
}

export default App;
