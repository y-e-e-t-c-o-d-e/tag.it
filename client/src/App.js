import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import './App.css';

// Importing Pages
import Home from './pages/Home';
import Login from './pages/Login';

const App = () => {
  return (
    <Router>
      <div>
        <Route exact path="/" component={Home} />
        <Route exact path="/login" component={Login} />
      </div>
    </Router>
    
  );
}

export default App;
