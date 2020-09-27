export function domainFromEmail(emailAddress: string) {
  const components = emailAddress.split('@');

  if (!components || components.length === 0) {
    return null;
  }

  return components.slice(-1)[0];
}
export function emailDomainIsEqual(emailAddress: string, domain: string) {
  return domainFromEmail(emailAddress) === domain;
}
