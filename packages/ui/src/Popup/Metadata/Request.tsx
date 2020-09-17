// Copyright 2019-2020 @polkadot/extension-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { MetadataDef } from '@polkadot/extension-inject/types';
import { ThemeProps } from '../../types';

import React, { useCallback, useContext } from 'react';
import styled from 'styled-components';

import { ActionBar, ActionContext, Button, Link, Table, Warning } from '../../components';
import useMetadata from '../../hooks/useMetadata';
import { approveMetaRequest, rejectMetaRequest } from '../../messaging';

interface Props {
  className?: string;
  request: MetadataDef;
  metaId: string;
  url: string;
}

function Request ({ className, metaId, request, url }: Props): React.ReactElement<Props> {
  const chain = useMetadata(request.genesisHash);
  const onAction = useContext(ActionContext);

  const _onApprove = useCallback(
    (): void => {
      approveMetaRequest(metaId)
        .then(() => onAction())
        .catch(console.error);
    },
    [metaId, onAction]
  );

  const _onReject = useCallback(
    (): void => {
      rejectMetaRequest(metaId)
        .then(() => onAction())
        .catch(console.error);
    },
    [metaId, onAction]
  );

  return (
    <div className={className}>
      <Table>
        <tr>
          <td className='label'>from</td>
          <td className='data'>{url}</td>
        </tr>
        <tr>
          <td className='label'>chain</td>
          <td className='data'>{request.chain}</td>
        </tr>
        <tr>
          <td className='label'>icon</td>
          <td className='data'>{request.icon}</td>
        </tr>
        <tr>
          <td className='label'>decimals</td>
          <td className='data'>{request.tokenDecimals}</td>
        </tr>
        <tr>
          <td className='label'>symbol</td>
          <td className='data'>{request.tokenSymbol}</td>
        </tr>
        <tr>
          <td className='label'>upgrade</td>
          <td className='data'>{chain ? chain.specVersion : 'unknown'} -&gt; {request.specVersion}</td>
        </tr>
      </Table>
      <div className='requestInfo'>
        <Warning className='requestWarning'>This approval will add the metadata to your extension instance, allowing future requests to be decoded using this metadata.</Warning>
        <Button
          className='btnAccept'
          onClick={_onApprove}
        >
            Yes, do this metadata update
        </Button>
        <ActionBar className='btnReject'>
          <Link
            isDanger
            onClick={_onReject}
          >
            Reject
          </Link>
        </ActionBar>
      </div>
    </div>
  );
}

export default styled(Request)(({ theme }: ThemeProps) => `
  .btnAccept {
    margin: 25px auto 0;
    width: 90%;
  }

  .btnReject {
    margin: 8px 0 15px 0;
    text-decoration: underline;
  }

  .icon {
    background: ${theme.buttonBackgroundDanger};
    color: white;
    min-width: 18px;
    width: 14px;
    height: 18px;
    font-size: 10px;
    line-height: 20px;
    margin: 16px 15px 0 1.35rem;
    font-weight: 800;
    padding-left: 0.5px;
  }

  .requestInfo {
    align-items: center;
    background: ${theme.highlightedAreaBackground};
    display: flex;
    flex-direction: column;
    margin-bottom: 8px;
  }

  .requestWarning {
    margin: 24px 24px 0 1.45rem;
  }
`);
