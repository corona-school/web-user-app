import React, { useState, useEffect, useContext } from 'react';
import { Redirect, useLocation } from 'react-router-dom';
import { redeemVerificationToken, getUserId } from '../api/api';
import { AuthContext } from '../context/AuthContext';
import storedCredentials from '../api/storedCredentials';
import PageLoading from '../components/PageLoading';

const dev = process.env.NODE_ENV === 'development';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const Verify: React.FC = () => {
  const [state, setState] = useState<
    'noToken' | 'pending' | 'failed' | 'success'
  >('noToken');

  const query = useQuery();
  const verificationToken = query.get('token');

  const auth = useContext(AuthContext);

  useEffect(() => {
    if (verificationToken) {
      setState('pending');
      redeemVerificationToken(verificationToken)
        .then((token) =>
          getUserId(token)
            .then((id) => {
              storedCredentials.write({ id, token });
              auth.setCredentials({ id, token }); //this triggers the login in AuthContext/UserContext
              auth.setStatus('pending'); //now auth should have valid credentials, so update the status (pending is the initial value)
              setState('success');
            })
            .catch((reason) => {
              if (dev) console.error('Verify: get user id failed:', reason);
              setState('failed');
            })
        )
        .catch((reason) => {
          if (dev) console.error('Verify: verify token failed:', reason);
          setState('failed');
        });
    }
  }, []);

  return (
    <PageLoading>
      {(() => {
        switch (state) {
          case 'noToken':
            return <>Kein Token gefunden</>;
          case 'pending':
            return <>Laden...</>;
          case 'success':
            return <Redirect to={query.get("redirectTo") || "/settings"} />;
          case 'failed':
            return <>Token ungültig</>;
        }
      })()}
    </PageLoading>
  );
};

export default Verify;
