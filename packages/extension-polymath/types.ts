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
  secKeys: string[];
  alias?: string;
}

export type IdentifiedAccount = {
  did?: string;
  keyType?: DidType;
  cdd?: boolean;
  address: string;
  didType?: DidType;
  balance: string;
}

export type UnsubCallback = () => void;

export type ReversedDidList =
  Record<string, {did: string, keyType: DidType, cdd: boolean | undefined}>;
