import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import './App.css';

// Importing Pages
import Home from './pages/Home/index';
import Login from './pages/Login/index';
import Signup from './pages/Signup/index';
import ClassCreation from './pages/ClassCreation/index';

// Importing Authentication
import PrivateRoute from "./auth/PrivateRoute";
import { AuthProvider } from "./auth/Auth";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div>
          <PrivateRoute exact path="/" component={Home} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={Signup} />
          <Route exact path="/createclass" component={ClassCreation} />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
