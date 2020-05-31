import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// Importing Pages
import Home from './pages/Home/index';
import Login from './pages/Login/index';
import Signup from './pages/Signup/index';
import ClassSettings from './pages/ClassSettings/index';
import Invitation from './pages/Invitation/index';
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
            <PrivateRoute exact path="/" component={Home} />
            <PrivateRoute exact path="/courses/:courseId" component={CourseView} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/signup" component={Signup} />
            <PrivateRoute exact path="/course/:courseId/post/:postId" component={PostView} />
            <PrivateRoute exact path="/course/:courseId/settings" component={ClassSettings} />
            <PrivateRoute exact path="/course/:courseId/invite/:inviteId" component={Invitation} />
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
