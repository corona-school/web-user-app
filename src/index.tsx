import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import './normalize.css';
import HttpsRedirect from 'react-https-redirect';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter } from 'react-router-dom';

import theme from './theme';
import { ApiProvider } from './context/ApiContext';
import { AuthProvider } from './context/AuthContext';
import { UserProvider } from './context/UserContext';
import { ModalProvider } from './context/ModalContext';
import App from './App';

document.documentElement.lang = 'de';

if (window.top.location !== window.self.location) {
  ReactDOM.render(<></>, document.getElementById('root'));
} else {
  ReactDOM.render(
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <ApiProvider>
            <UserProvider>
              <ModalProvider>
                <HttpsRedirect
                  disabled={process.env.REACT_APP_MODE === 'LOCAL'}
                >
                  <BrowserRouter>
                    <App />
                  </BrowserRouter>
                </HttpsRedirect>
              </ModalProvider>
            </UserProvider>
          </ApiProvider>
        </AuthProvider>
      </ThemeProvider>
    </React.StrictMode>,
    document.getElementById('root')
  );
}
