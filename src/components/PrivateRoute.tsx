import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import PageLoading from './PageLoading';

const PrivateRoute = ({
  children,
  active = true,
  ...rest
}: {
  children: React.ReactNode;
  active?: boolean;
  [index: string]: any;
}) => {
  const authContext = useContext(AuthContext);

  return (
    <Route
      {...rest}
      render={({ location }) => {
        if (!active) {
          return <Redirect to="/" />; //TODO: add error page
        }

        switch (authContext.status) {
          case 'pending':
            return <PageLoading />;
          case 'authorized':
            return children;
          case 'missing':
          case 'invalid':
            return <Redirect to="/login" />;
        }
      }}
    />
  );
};

export default PrivateRoute;
