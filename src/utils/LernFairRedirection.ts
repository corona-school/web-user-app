import { useContext } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getDomainComponents } from './DomainUtils';
import { getUserId } from '../api/api';
import storedCredentials from '../api/storedCredentials';

export function LernFairRedirection() {
  const authContext = useContext(AuthContext);
  const location = useLocation();
  const history = useHistory();

  const domainComponents = getDomainComponents();
  const subdomain = domainComponents?.length > 0 && domainComponents[0];

  const params = new URLSearchParams(location.search);
  const path = location.pathname;

  const ShouldRedirectToLernFairDomain = () => {
    return (
      authContext.status !== 'pending' &&
      domainComponents.includes('corona-school')
    );
  };

  const ShouldSetLegacyToken = () => {
    return (
      ['invalid', 'missing'].includes(authContext.status) &&
      !(path.startsWith('/login') && params.has('token')) &&
      params.has('legacyToken')
    );
  };

  const RemoveLegacyTokenInUrl = () => {
    params.delete('legacyToken');
    history.replace({
      search: params.toString(),
    });
  };

  const SetToken = (token: string) => {
    getUserId(token).then((id) => {
      storedCredentials.write({ id, token });
      authContext.setCredentials({ id, token });
      authContext.setStatus('pending');
    });
  };

  if (ShouldRedirectToLernFairDomain()) {
    params.append(
      'legacyToken',
      authContext.status === 'authorized' && authContext.credentials.token
    );
    window.location.href = `https://${
      subdomain ?? 'my'
    }.lern-fair.de${path}?${params.toString()}`;
  }

  if (ShouldSetLegacyToken()) {
    const token = params.get('legacyToken');
    SetToken(token);
    RemoveLegacyTokenInUrl();
  } else if (params.has('legacyToken') && authContext.status !== 'pending') {
    RemoveLegacyTokenInUrl();
  }
}
