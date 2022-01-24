import React, { useContext } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
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
import Logout from './routes/Logout';
import Verify from './routes/Verify';
import PublicCourse from './routes/PublicCourse';

import { ScreeningStatus } from './types';
import NotFound from './routes/NotFound';
import PageComponent from './components/PageComponent';
import Course from './routes/Course';
import { CourseForm } from './routes/CourseForm';
import CourseDetail from './routes/CourseDetail';
import PublicCourseDetail from './routes/PublicCourseDetail';
import ProjectCoach from './routes/ProjectCoach';
import { CourseOverview } from './routes/CourseOverview';
import { Modals } from './Modals';
import GuestJoinCourseMeeting from './routes/GuestJoinCourseMeeting';
import InterestConfirmation from './routes/InterestConfirmation';
import { LernFairRedirection } from './utils/LernFairRedirection';
import RemissionRequest from './routes/RemissionRequest';
import { getDomainComponents } from './utils/DomainUtils';
import { getCooperationModeForSubdomain } from './utils/RegistrationCooperationUtils';
import RegisterTutee from './routes/RegisterTutee';

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
  const cooperationMode = getCooperationModeForSubdomain(subdomain);

  LernFairRedirection();

  if (subdomain && cooperationMode) {
    // render the special page for cooperations with states of Germany
    return (
      <>
        <GlobalStyle />
        <Switch>
          <Route exact path="/">
            <RegisterTutee cooperationMode={cooperationMode} />
          </Route>
          <Route component={NotFound} />
        </Switch>
      </>
    );
  }

  return (
    <>
      <GlobalStyle />
      <Modals />
      <Switch>
        <Route path="/login">
          <Login mode="login" />
        </Route>
        <Route path="/logout">
          <Logout />
        </Route>
        <Route path="/register">
          <Login mode="register" />
        </Route>
        <Route exact path="/public/courses">
          <PublicCourse />
        </Route>
        <Route exact path="/public/courses/:id">
          <ScrollToTopOnMount />
          <PublicCourseDetail />
        </Route>
        <Route path="/verify">
          <Verify />
        </Route>
        <Route path="/confirm">
          <InterestConfirmation />
        </Route>
        <Route path="/video/:token">
          <GuestJoinCourseMeeting />
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
            <PrivateRoute
              path="/courses/overview"
              active={
                userContext.user.type === 'pupil' ||
                userContext.user.instructorScreeningStatus ===
                  ScreeningStatus.Accepted
              }
            >
              <CourseOverview backButtonRoute="/courses" />
            </PrivateRoute>
            <PrivateRoute path="/courses/:id" comeback>
              <ScrollToTopOnMount />
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
          <PrivateRoute path="/remission-request">
            <RemissionRequest />
          </PrivateRoute>
        </PageComponent>
        <Route component={NotFound} />
      </Switch>
    </>
  );
};

/* Small helper to scroll back to top when navigating across certain routes
   c.f. https://reactrouter.com/web/guides/scroll-restoration */
function ScrollToTopOnMount() {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return null;
}

export default App;
