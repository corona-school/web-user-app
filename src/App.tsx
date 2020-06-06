import React, { useContext } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import { UserContext } from './context/UserContext';

import PrivateRoute from './components/PrivateRoute';

import Dashboard from './routes/Dashboard';
import Matches from './routes/Matches';
import Settings from './routes/Settings';
import Feedback from './routes/Feedback';
import Help from './routes/Help';
import Login from './routes/Login';
import Verify from './routes/Verify';

import { ScreeningStatus } from './types';
import NotFound from './routes/NotFound';
import PageComponent from './components/PageComponent';
import Course from './routes/Course';
import Register from './routes/Register';
import RegisterTutee from './routes/RegisterTutee';
import RegisterTutor from './routes/RegisterTutor';

const GlobalStyle = createGlobalStyle`


  html {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    font-size: 14px;
    overflow: hidden;

  }

  *{
    box-sizing: border-box;
  }


  button {
    background-color: unset;
    border: unset;
    cursor: pointer;
    padding: 0;
  }
`;

const App: React.FC = () => {
  const userContext = useContext(UserContext);

  return (
    <>
      <GlobalStyle />
      <Switch>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/register">
          <Register />
        </Route>
        <Route path="/register/tutee">
          <RegisterTutee />
        </Route>
        <Route path="/register/tutor">
          <RegisterTutor />
        </Route>
        <Route path="/verify">
          <Verify />
        </Route>
        <PageComponent>
          <Route exact path="/">
            <Redirect to="/settings" />
          </Route>
          <PrivateRoute path="/dashboard">
            <Dashboard />
          </PrivateRoute>
          <PrivateRoute path="/courses">
            <Course />
          </PrivateRoute>
          <PrivateRoute
            path="/matches"
            active={
              userContext.user.type === 'pupil' ||
              userContext.user.screeningStatus === ScreeningStatus.Accepted
            }
          >
            <Matches />
          </PrivateRoute>
          <PrivateRoute path="/settings">
            <Settings />
          </PrivateRoute>
          <PrivateRoute path="/feedback">
            <Feedback />
          </PrivateRoute>
          <PrivateRoute path="/help">
            <Help />
          </PrivateRoute>
        </PageComponent>
        <Route component={NotFound} />
      </Switch>
    </>
  );
};

export default App;
