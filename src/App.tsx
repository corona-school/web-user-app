import React, { useEffect, useContext } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import { UserContext } from './context/UserContext';
import { AuthContext } from './context/AuthContext';
import storedCredentials from './api/storedCredentials';
import PrivateRoute from './components/PrivateRoute';

import Dashboard from './routes/Dashboard';
import Matches from './routes/Matches';
import Settings from './routes/Settings';
import Feedback from './routes/Feedback';
import Help from './routes/Help';
import Login from './routes/Login';
import Verify from './routes/Verify';

import poppinsRegular from './assets/fonts/Poppins-Regular.ttf';
import poppinsBold from './assets/fonts/Poppins-Bold.ttf';
import poppinsItalic from './assets/fonts/Poppins-Italic.ttf';
import { ScreeningStatus } from './types';
import NotFound from './routes/NotFound';

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: Poppins;
    src: url(${poppinsRegular}) format('truetype');
  }
  @font-face {
    font-family: Poppins;
    src: url(${poppinsBold}) format('truetype');
    font-weight: bold;
  }
  @font-face {
    font-family: Poppins;
    src: url(${poppinsItalic}) format('truetype');
    font-style: italic;
  }

  html {
    font-family: Poppins, sans-serif;
    font-size: 14px;
    overflow-y: hidden;
  }

  button {
    background-color: unset;
    border: unset;
    cursor: pointer;
    padding: 0;
  }
`;

const App: React.FC = () => {
  const authContext = useContext(AuthContext);
  const userContext = useContext(UserContext);

  return (
    <>
      <GlobalStyle />
      <Switch>
        <Route exact path="/">
          <Redirect to="/settings" />
        </Route>
        {/* <PrivateRoute path="/dashboard">
          <Dashboard />
        </PrivateRoute> */}
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
        {/* <PrivateRoute path="/feedback">
          <Feedback />
        </PrivateRoute> */}
        {/* <PrivateRoute path="/help">
          <Help />
        </PrivateRoute> */}
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/verify">
          <Verify />
        </Route>
        <Route component={NotFound} />
      </Switch>
    </>
  );
};

export default App;

/*
<AuthButton />

<nav>
<Link to="/dashboard">Dashboard</Link>
</nav>



<PrivateRoute path="/dashboard">
<Dashboard />
</PrivateRoute>
<PrivateRoute path="/matches">
<Matches />
</PrivateRoute>

<PrivateRoute path="/account">
<Account />
</PrivateRoute>

<PrivateRoute path="/feedback">
<Feedback />
</PrivateRoute>

<PrivateRoute path="/help">
<Help />
</PrivateRoute>

redirect...
<Route path="/">
</Route>
*/

// function AuthButton() {
//   let history = useHistory();

//   return authentication.isAuthenticated ? (
//     <p>
//       Welcome!{" "}
//       <button
//         onClick={() => {
//           authentication.signout(() => history.push("/"));
//         }}
//       >
//         Sign out
//       </button>
//     </p>
//   ) : (
//       <p>You are not logged in.</p>
//     );
// }
