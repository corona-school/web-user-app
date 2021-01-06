import { supportedStateCooperations } from '../assets/stateCooperations';

export const partnerSchoolSubdomain = 'partnerschule';

export type StateCooperationInfo = {
  name: string;
  abbrev: string;
  subdomain: string;
  // TODO
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  coatOfArms?: any;
};

export interface StateCooperationMode {
  kind: 'SpecificStateCooperation';
  stateInfo: StateCooperationInfo;
}
export interface SchoolCooperationMode {
  kind: 'GeneralSchoolCooperation';
}

// a cooperation with public entities where the registrants will always be pupils (!) and always expecting a teacher's email address
export type CooperationMode = StateCooperationMode | SchoolCooperationMode;

export function stateInfoForStateSubdomain(subdomain: string) {
  return supportedStateCooperations.find((c) => c.subdomain === subdomain);
}

export function isPartnerSchoolSubdomain(subdomain: string) {
  return partnerSchoolSubdomain === subdomain;
}

export function getCooperationModeForSubdomain(
  subdomain: string
): CooperationMode | null {
  // no subdomain given
  if (!subdomain) {
    return null;
  }

  // partner school subdomain
  if (isPartnerSchoolSubdomain(subdomain)) {
    return {
      kind: 'GeneralSchoolCooperation',
    };
  }

  // official subdomain of an cooperation with an entire state
  const stateInfo = stateInfoForStateSubdomain(subdomain);
  if (stateInfo) {
    return {
      kind: 'SpecificStateCooperation',
      stateInfo,
    };
  }

  // default null in all other cases
  return null;
}
