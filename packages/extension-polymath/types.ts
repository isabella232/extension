export enum DidType {
  primary = 'primary',
  secondary = 'secondary'
}

export type AccountData = {
  address: string;
  didType?: DidType;
  balance: string;
}

export type IdentityData = {
  cdd?: boolean;
  did: string;
  priKey: string;
  secKeys: string[]
}

export type UnsubCallback = () => void;
