import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import './normalize.css';
import HttpsRedirect from 'react-https-redirect';
import theme from './theme';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter } from 'react-router-dom';
import { ApiProvider } from './context/ApiContext';
import { AuthProvider } from './context/AuthContext';
import { UserProvider } from './context/UserContext';
import { ModalProvider } from './context/ModalContext';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <ApiProvider>
          <UserProvider>
            <ModalProvider>
              <HttpsRedirect>
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
