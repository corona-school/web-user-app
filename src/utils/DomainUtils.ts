export function getDomainComponents() {
  const { host } = window.location;

  return host.split('.');
}
