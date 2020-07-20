import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import PageLoading from './PageLoading';

// If you set comeback, the user will be redirected to this page after login / registration

const PrivateRoute = ({
  children,
  active = true,
  comeback = false,
  ...rest
}: {
  children: React.ReactNode;
  active?: boolean;
  [index: string]: any;
  comeback?: boolean;
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
            return <Redirect to={comeback ? `/login?path=${location.pathname}` : `/login`} />;
        }
      }}
    />
  );
};

export default PrivateRoute;
