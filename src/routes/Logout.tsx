import React, { useEffect, useContext } from 'react';
import { Redirect } from 'react-router-dom';
import Context from '../context';

const logout = (authContext) => {
  authContext.setCredentials({ id: '', token: '' });
  authContext.setStatus('missing');
  authContext.deleteStoredCredentials();
};

const Logout: React.FC = () => {
  const authContext = useContext(Context.Auth);

  useEffect(() => {
    logout(authContext);
  }, [authContext]);

  return <Redirect to="/login" />;
};

export default Logout;
