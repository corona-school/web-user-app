import React, { useContext } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import { UserContext } from './context/UserContext';

import PrivateRoute from './components/PrivateRoute';

import Dashboard from './routes/Dashboard';
import Matches from './routes/Matches';
import Settings from './routes/Settings';
import Mentoring from './routes/Mentoring';
import Support from './routes/Support';
import Feedback from './routes/Feedback';
import Help from './routes/Help';
import Login from './routes/Login';
import Verify from './routes/Verify';
import PublicCourse from './routes/PublicCourse';

import { ScreeningStatus } from './types';
import NotFound from './routes/NotFound';
import PageComponent from './components/PageComponent';
import Course from './routes/Course';
import Register from './routes/Register';
import RegisterTutee from './routes/RegisterTutee';
import RegisterTutor from './routes/RegisterTutor';
import { CourseForm } from './routes/CourseForm';
import CourseDetail from './routes/CourseDetail';
import PublicCourseDetail from './routes/PublicCourseDetail';
import { getDomainComponents } from './utils/DomainUtils';
import {
  isSupportedStateSubdomain,
  stateInfoForStateSubdomain,
} from './assets/supportedStateCooperations';
import ProjectCoach from './routes/ProjectCoach';

const GlobalStyle = createGlobalStyle`


  html {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    font-size: 14px;
    height: 100%;
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

  const domainComponents = getDomainComponents();
  const subdomain = domainComponents?.length > 0 && domainComponents[0];
  if (subdomain && isSupportedStateSubdomain(subdomain)) {
    // render the special page for cooperations with states of Germany
    return (
      <>
        <GlobalStyle />
        <Switch>
          <Route exact path="/">
            <RegisterTutee
              stateCooperationInfo={stateInfoForStateSubdomain(
                domainComponents[0]
              )}
            />
          </Route>
          <Route component={NotFound} />
        </Switch>
      </>
    );
  }
  // jufo cooperation
  const isJufoSubdomain = subdomain === 'jufo';

  return (
    <>
      <GlobalStyle />
      <Switch>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/register/tutee">
          <RegisterTutee isJufoSubdomain={isJufoSubdomain} />
        </Route>
        <Route path="/register/internship">
          <RegisterTutor isInternship />
        </Route>
        <Route path="/register/club">
          <RegisterTutor isClub isJufoSubdomain={isJufoSubdomain} />
        </Route>
        <Route path="/register/student">
          <RegisterTutor isStudent isJufoSubdomain={isJufoSubdomain} />
        </Route>
        <Route path="/register/tutor">
          <RegisterTutor isJufoSubdomain={isJufoSubdomain} />
        </Route>
        <Route path="/register">
          <Register />
        </Route>
        <Route exact path="/public/courses">
          <PublicCourse />
        </Route>
        <Route exact path="/public/courses/:id">
          <PublicCourseDetail />
        </Route>
        <Route path="/verify">
          <Verify />
        </Route>
        <PrivateRoute path="/courses/edit/:id">
          <CourseForm />
        </PrivateRoute>
        <PrivateRoute path="/courses/create">
          <CourseForm />
        </PrivateRoute>
        <PageComponent>
          <Route exact path="/">
            <Redirect to="/settings" />
          </Route>
          <PrivateRoute path="/dashboard">
            <Dashboard />
          </PrivateRoute>
          <Switch>
            <PrivateRoute path="/courses/:id" comeback>
              <CourseDetail />
            </PrivateRoute>
            <PrivateRoute
              path="/courses"
              active={
                userContext.user.type === 'pupil' ||
                userContext.user.instructorScreeningStatus ===
                  ScreeningStatus.Accepted
              }
            >
              <Course />
            </PrivateRoute>
          </Switch>

          <PrivateRoute
            path="/matches"
            active={
              userContext.user.type === 'pupil' ||
              userContext.user.screeningStatus === ScreeningStatus.Accepted
            }
          >
            <Matches />
          </PrivateRoute>
          <PrivateRoute
            path="/project-coaching"
            active={
              userContext.user.type === 'pupil' ||
              userContext.user.projectCoachingScreeningStatus ===
                ScreeningStatus.Accepted
            }
          >
            <ProjectCoach />
          </PrivateRoute>
          <PrivateRoute path="/settings">
            <Settings />
          </PrivateRoute>
          <PrivateRoute path="/mentoring">
            <Mentoring />
          </PrivateRoute>
          <PrivateRoute path="/support">
            <Support />
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
