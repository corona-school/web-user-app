import Icons from './icons';

export type StateCooperationInfo = {
  name: string;
  abbrev: string;
  subdomain: string;
  // TODO
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  coatOfArms?: any;
};

export const supportedStateCooperations: StateCooperationInfo[] = [
  {
    name: 'Nordrhein-Westfalen',
    abbrev: 'NW',
    subdomain: 'nrw',
    coatOfArms: Icons.CoatOfArmsNRW,
  },
];

export function isSupportedStateSubdomain(subdomain: string) {
  return supportedStateCooperations.some((c) => c.subdomain === subdomain);
}

export function stateInfoForStateSubdomain(subdomain: string) {
  return supportedStateCooperations.find((c) => c.subdomain === subdomain);
}
