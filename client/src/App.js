import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import './App.css';

// Importing Pages
import Home from './pages/Home/index';
import Login from './pages/Login/index';
import Signup from './pages/Signup/index';

// Importing Authentication
import PrivateRoute from "./auth/PrivateRoute";
import { AuthProvider } from "./auth/Auth";
import AddClass from './pages/AddClass';

import CourseRoute from './components/CourseRoute';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div>
          <Switch>
            <PrivateRoute exact path="/" component={Home} />
            <CourseRoute exact path="/course/:courseId" component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/signup" component={Signup} />
            <PrivateRoute exact path="/add" component={AddClass} />
            <Route exact path="/*" component={() => {
              window.location.href = "/";
            }} />
          </Switch>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
