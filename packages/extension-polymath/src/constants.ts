import { NetworkName } from './types';

const networkURLs: Record<NetworkName, string> = {
  alcyone: 'wss://alcyone-rpc.polymesh.live',
  pmf: 'wss://pmf.polymath.network'
};

const networkNames: Record<NetworkName, string> = {
  alcyone: 'Alcyone Testnet',
  pmf: 'PMF'
};

const defaultNetwork: NetworkName = NetworkName.pmf;

export {
  networkURLs,
  networkNames,
  defaultNetwork
};
