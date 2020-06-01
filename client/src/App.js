import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// Importing Pages
import Home from './pages/Home/index';
import Login from './pages/Login/index';
import Signup from './pages/Signup/index';
import ClassCreation from './pages/ClassCreation/index';
import Staff from './pages/Staff/index';
import ClassSettings from './pages/ClassSettings/index';
import PostView from './pages/PostView';

// Importing Authentication
import PrivateRoute from "./auth/PrivateRoute";
import { AuthProvider } from "./auth/Auth";
import AddClass from './pages/AddClass';
import CourseView from './pages/CourseView';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div>
          <Switch>
            <PrivateRoute exact path="/courses/:courseId/settings" component={ClassSettings} />
            <PrivateRoute exact path="/courses/:courseId" component={CourseView} />
            <PrivateRoute exact path="/courses/:courseId/staff" component={Staff} />
            <PrivateRoute exact path="/courses/:courseId/post/:postId" component={PostView} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/signup" component={Signup} />
            <PrivateRoute exact path="/create-course" component={ClassCreation} />
            <PrivateRoute exact path="/add" component={AddClass} />
            <PrivateRoute exact path="/" component={Home} />
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
