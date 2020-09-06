// Copyright 2019-2020 @polkadot/extension-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ThemeProps as Props } from '../types';

import React, { useContext, useState } from 'react';
import styled from 'styled-components';

import { ActionContext, Box, Button, ButtonArea, List, VerticalSpace, Checkbox } from '../components';
import useTranslation from '../hooks/useTranslation';
import { Header } from '../partials';

export default function Welcome (): React.ReactElement<Props> {
  const { t } = useTranslation();
  const onAction = useContext(ActionContext);

  const [isPPChecked, setIsPPChecked] = useState<boolean>(false);
  const [isTSChecked, setIsTSChecked] = useState<boolean>(false);

  const _onClick = (): void => {
    window.localStorage.setItem('welcome_read', 'ok');
    onAction();
  };

  return (
    <>
      <Header text='Welcome'/>
      <Note>{t<string>('A couple of things to note before we begin:')}</Note>
      <TextBox>
        <List>
          <li>We do not collect keys and passwords in our servers.</li>
          <li>This wallet does not use any trackers or analytics; however, some applications you connect the wallet to may use trackers or analytics.</li>
          <li>Please read our <a href='https://polymath.network/polymesh-aldebaran-testnet/privacy-policy'
            rel='noopener noreferrer'
            target='_blank'>Privacy Policy</a></li> to see what information we do collect and how it is processed.
        </List>
      </TextBox>
      <Checkbox checked={isPPChecked}
        className='checkbox'
        label={<>
          I have read and accept the Polymath <a href='https://polymath.network/polymesh-aldebaran-testnet/privacy-policy'
            rel='noopener noreferrer'
            target='_blank'>Privacy Policy</a>
        </>}
        onClick={() => setIsPPChecked(!isPPChecked)}
      />
      <Checkbox checked={isTSChecked}
        className='checkbox'
        label={<>
          I have read and accept the Polymath <a href='https://polymath.network/polymesh-aldebaran-testnet/wallet-terms'
            rel='noopener noreferrer'
            target='_blank'>Terms of Service</a>
        </>}
        onClick={() => setIsTSChecked(!isTSChecked)}
      />
      <VerticalSpace />
      <ButtonArea>
        <Button isDisabled={!isPPChecked || !isTSChecked}
          onClick={_onClick}>Continue</Button>
      </ButtonArea>
    </>
  );
}

const Note = styled.p(({ theme }: Props) => `
  color: ${theme.subTextColor};
  margin-bottom: 6px;
  margin-top: 0;
`);

const TextBox = styled(Box)(({ theme }: Props) => `
  border: 1px solid ${theme.inputBorderColor};
  color: ${theme.subTextColor};
  margin: 0.75rem 24px;
`);
