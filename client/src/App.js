import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// Importing Pages
import * as Pages from "./pages"

// Importing Authentication
import { AuthProvider, PrivateRoute} from "./auth";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div>
          <Switch>
            <PrivateRoute exact path="/" component={Pages.Home} />
            <PrivateRoute exact path="/courses/:courseId" component={Pages.CourseView} />
            <PrivateRoute exact path="/courses/:courseId/posts/:postId" component={Pages.PostView} />
            <PrivateRoute exact path="/courses/:courseId/settings" component={Pages.ClassSettings} />
            <PrivateRoute exact path="/courses/:courseId/staff" component={Pages.Staff} />
            <PrivateRoute exact path="/courses/:courseId/invite/:inviteId" component={Pages.Invitation} />
            <Route exact path="/login" component={Pages.Login} />
            <Route exact path="/signup" component={Pages.Signup} />
            <PrivateRoute exact path="/add" component={Pages.AddClass} />
            <PrivateRoute exact path="/create-course" component={Pages.ClassCreation} />
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
