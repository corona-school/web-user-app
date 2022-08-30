/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-explicit-any */

declare global {
  interface Window {
    _paq: any;
  }
}

export const MatomoScript = () => {
  window._paq = window._paq ?? [];
  const paq = window._paq;

  /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
  paq.push(['setDomains', ['*.lern-fair.de']]);
  paq.push(['enableCrossDomainLinking']);
  paq.push(['trackPageView']);
  paq.push(['enableLinkTracking']);

  const u = 'https://lernfair.matomo.cloud/';
  paq.push(['setTrackerUrl', `${u}matomo.php`]);
  paq.push(['setSiteId', '1']);

  const d = document;
  const g = d.createElement('script');
  const s = d.getElementsByTagName('script')[0];

  g.type = 'text/javascript';
  g.async = true;
  g.src = '//cdn.matomo.cloud/lernfair.matomo.cloud/matomo.js';
  s.parentNode.insertBefore(g, s);
};

export const MatomoTrackRegistration = () => {
  // old method
  window._paq.push([
    'trackEvent',
    'Formular Interaktion',
    'Registrierung Abschluss',
  ]);

  // testing new method
  window._paq.push(['trackGoal', 2]);
};
