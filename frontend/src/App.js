// import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import LoginRegister from "./pages/LoginRegister/LoginRegister";
import Home from "./pages/Home/Home";
import './App.css';

function App() {
  // let token = localStorage.getItem('token');
  // if(token){
  //   window.location.href = '/';
  // } else {
  //   window.location.href = '/login';
  // }

  return (
    <div className="App">
      <LoginRegister />
    </div>
  );
}

export default App;
