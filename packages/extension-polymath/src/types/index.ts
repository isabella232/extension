export enum DidType {
  primary = 'primary',
  secondary = 'secondary'
}

export type AccountData = {
  address: string;
  didType?: DidType;
  balance?: string;
  name?: string;
}

export type IdentityData = {
  cdd?: CDD;
  did: string;
  priKey: string;
  secKeys?: string[];
  alias?: string;
}

export type IdentifiedAccount = {
  name?: string;
  did?: string;
  keyType?: DidType;
  cdd?: CDD;
  address: string;
  didType?: DidType;
  didAlias: string;
  balance?: string;
}

export type UnsubCallback = () => void;

export type ReversedDidList =
  Record<string, {did: string, keyType: DidType, cdd?: CDD, didAlias: string}>;

export enum NetworkName {
  pmf = 'pmf',
  alcyone = 'alcyone'
}

export type CDD = {
  issuer: string,
  expiry?: number
}
