import apiPromise from './apiPromise';
import { SignerPayloadJSON } from '@polkadot/types/types';
import { upperFirst } from 'lodash-es';
import { ResponsePolyCallDetails } from '@polkadot/extension-base/background/types';

async function callDetails (request: SignerPayloadJSON): Promise<ResponsePolyCallDetails> {
  const api = await apiPromise;

  console.log('IN API');
  const res = api.registry.createType('Call', request.method);
  const { args, method, section } = res;

  // Protocol fees
  const opName = upperFirst(section) + upperFirst(method);
  const fee = await api.query.protocolFee.baseFees(opName);

  // Network fee
  const extrinsic = api.tx[section][method](args);
  const { partialFee } = await extrinsic.paymentInfo(request.address);

  return {

    protocolFee: fee.toString(),
    networkFee: partialFee.toString()
  };
}

export default callDetails;
