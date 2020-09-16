import { NetworkName } from './types';

const networkURLs: Record<NetworkName, string> = {
  alcyone: 'wss://alcyone-rpc.polymesh.live',
  pmf: 'wss://pmf.polymath.network'
};

const defaultNetwork: NetworkName = NetworkName.pmf;

export {
  networkURLs,
  defaultNetwork
};
