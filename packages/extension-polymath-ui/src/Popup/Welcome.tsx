// Copyright 2019-2020 @polkadot/extension-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ThemeProps as Props } from '../types';

import React, { useContext, useState } from 'react';

import { ActionContext } from '../components';
import { Button, Box, Checkbox, Text, Header, Icon } from '../ui';
import { SvgBull } from '../assets/images/Bull';

export default function Welcome (): React.ReactElement<Props> {
  const onAction = useContext(ActionContext);

  const [isPPChecked, setIsPPChecked] = useState<boolean>(false);
  const [isTSChecked, setIsTSChecked] = useState<boolean>(false);

  const _onClick = (): void => {
    window.localStorage.setItem('welcome_read', 'ok');
    onAction();
  };

  return (
    <>
      <Header>
        <Icon Asset={SvgBull}
          height={140}
          width={328} />
      </Header>
      <Box mt='m'>
        <Box>
          <Text color='gray.1'>A couple of things to note before we begin:</Text>
        </Box>
        <Box m='s'>
          <Box>
            <li>
              <Text color='gray.1'>We do not collect keys and passwords in our servers.</Text>
            </li>
            <li>
              <Text color='gray.1'>
                This wallet does not use any trackers or analytics; however, some applications you connect the wallet to
                may use trackers or analytics.
              </Text>
            </li>
            <li>
              <Text color='gray.1'>
                Please read our{' '}
                <a
                  href='https://polymath.network/polymesh-aldebaran-testnet/privacy-policy'
                  rel='noopener noreferrer'
                  target='_blank'
                >
                  Privacy Policy
                </a>{' '}
                to see what information we do collect and how it is processed.
              </Text>
            </li>
          </Box>
        </Box>
        <Box m='s'>
          <Checkbox
            checked={isPPChecked}
            label={
              <Text fontSize='0' color='gray.1'>
                I have read and accept the Polymath{' '}
                <a
                  href='https://polymath.network/polymesh-aldebaran-testnet/privacy-policy'
                  rel='noopener noreferrer'
                  target='_blank'
                >
                  Privacy Policy
                </a>
              </Text>
            }
            onClick={() => setIsPPChecked(!isPPChecked)}
          />
          <Checkbox
            checked={isTSChecked}
            label={
              <Text color='gray.1' fontSize='0'>
                I have read and accept the Polymath{' '}
                <a
                  href='https://polymath.network/polymesh-aldebaran-testnet/wallet-terms'
                  rel='noopener noreferrer'
                  target='_blank'
                >
                  Terms of Service
                </a>
              </Text>
            }
            onClick={() => setIsTSChecked(!isTSChecked)}
          />
        </Box>
      </Box>
      <Box mb='m'
        mt='l'>
        <Button disabled={!isPPChecked || !isTSChecked}
          fluid
          onClick={_onClick}>
          Continue
        </Button>
      </Box>
    </>
  );
}
