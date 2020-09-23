// Copyright 2019-2020 @polkadot/extension-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useContext, useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';

import { AccountContext, Link } from '../../components';
import AddAccount from './AddAccount';
import { Text, Box, Header, TextEllipsis, Flex, Icon, Heading, Button, StatusBadge } from '../../ui';
import { showAccount } from '../../messaging';
import { AccountWithChildren } from '@polkadot/extension-base/background/types';
import { SvgCheckboxMarkedCircle,
  SvgAlertCircle,
  SvgViewDashboard,
  SvgDotsVertical,
  SvgPlus } from '@polymath/ui/assets/images/icons';
import { formatters } from '../../util';
import { IdentifiedAccount } from '@polymath/extension-core/types';
import { AccountsContainer } from './AccountsContainer';
import { useHistory } from 'react-router';

export default function Accounts (): React.ReactElement {
  const [currentAccountAddress, setCurrentAccountAddress] = useState('');
  const [currentAccount, setCurrentAccount] = useState<AccountWithChildren>();
  const { hierarchy, network, polymeshAccounts } = useContext(AccountContext);
  const history = useHistory();

  const select = (accounts: AccountWithChildren[], selectedAccount: string) => {
    setCurrentAccountAddress(selectedAccount);
    accounts.map((account) => {
      showAccount(account.address, account.address === selectedAccount).catch(console.error);

      if (account.children) {
        select(account.children, selectedAccount);
      }
    });
  };

  const selectAccount = (accountAddress: string) => {
    select(hierarchy, accountAddress);
  };

  const findSelected = useCallback((accounts: AccountWithChildren[]) => {
    return accounts.map((account) => {
      if (!account.isHidden) {
        return account;
      }

      if (account.children) {
        return findSelected(account.children);
      }
    })[0];
  });

  useEffect(() => {
    setCurrentAccount(findSelected(hierarchy));
  }, [currentAccountAddress, findSelected, hierarchy]);

  const renderStatus = (isVerified: boolean) => {
    const color = isVerified ? 'success' : 'alert';
    const statusText = isVerified ? 'Verified' : 'Not verified';
    const iconAsset = isVerified ? SvgCheckboxMarkedCircle : SvgAlertCircle;

    return (
      <Flex flexDirection='row'>
        <Box mr='1'>
          <Icon Asset={iconAsset}
            color={color}
            height={14}
            width={14} />
        </Box>
        <Box>
          <Text color={color}
            variant='b3m'>
            {statusText}
          </Text>
        </Box>
      </Flex>
    );
  };

  const groupAccounts = (key: string) => (array:IdentifiedAccount[]) =>
    array.reduce((groupedAccounts: IdentifiedAccount[], account: IdentifiedAccount) => {
      const value = account[key];

      groupedAccounts[value] = (groupedAccounts[value] || []).concat(account);

      return groupedAccounts;
    }, {});

  const groupedAccounts = groupAccounts('did')(polymeshAccounts);

  console.log('SELECTEDACCOUNT', currentAccount);

  return (
    <>
      {hierarchy.length === 0 ? (
        <AddAccount />
      ) : (
        <>
          <Header>
            <Flex alignItems='center'
              flexDirection='row'
              justifyContent='space-between'
              mb='m'>
              <StatusBadge variant='yellow'>{network}</StatusBadge>
              <Flex flexDirection='row'
                justifyContent='center'>
                <Icon Asset={SvgViewDashboard}
                  color='gray.0'
                  height={24}
                  width={24} />
                <Icon Asset={SvgDotsVertical}
                  color='gray.0'
                  height={24}
                  width={24} />
              </Flex>
            </Flex>
            <Box bg='brandLightest'
              borderRadius='2'>
              {currentAccount && (
                <Flex flexDirection='row'
                  justifyContent='space-between'
                  mx='1'>
                  <Flex flexDirection='row'>
                    <Box mr='1'>
                      <Text color='brandMain'
                        variant='c2m'>
                        Did Label
                      </Text>
                    </Box>
                    <Text color='gray.2'
                      variant='c2'>
                      <TextEllipsis size={12}>{currentAccount?.did || 'hrjekwohrjkhjkethjkewthejlk'}</TextEllipsis>
                    </Text>
                  </Flex>
                  {renderStatus(false)}
                </Flex>
              )}
            </Box>
            <Flex flexDirection='row'
              mt='s'>
              <Text color='gray.0'
                variant='b1m'>
                {currentAccount?.name}
              </Text>
            </Flex>
            <Flex alignItems='flex-end'
              flexDirection='row'
              mt='1'>
              <Heading color='gray.0'
                variant='h5'>
                {formatters.formatAmount(currentAccount?.balance, 2, true)}
              </Heading>
              <Box ml='s'>
                <Text color='gray.0'
                  variant='b2'>
                  POLYX
                </Text>
              </Box>
            </Flex>
            <Box mt='m'>
              <Box borderColor='gray.0'
                borderRadius='3'
                borderStyle='solid'
                borderWidth={2}>
                <Flex alignItems='center'
                  height={32}
                  justifyContent='center'>
                  <Text color='gray.0'
                    variant='b2m'>
                    Manage your account
                  </Text>
                </Flex>
              </Box>
            </Box>
          </Header>
          <AccountsArea>
            <Flex justifyContent='space-between'
              pt='m'
              px='s'>
              <Text color='gray.1'
                variant='c2'>
                ACCOUNTS
              </Text>
              <Link to='/account/create'>
                <Flex justifyContent='center'>
                  <Box mx='s'>
                    <Icon Asset={SvgPlus}
                      color='brandMain'
                      height={14}
                      width={14} />
                  </Box>
                  <Text color='brandMain'
                    variant='b2'>
                    Add a key
                  </Text>
                </Flex>
              </Link>
            </Flex>
            {
              Object.keys(groupedAccounts).sort((a) => (a === undefined ? 1 : -1)).map((did: string, index) => {
                return <AccountsContainer accounts={groupedAccounts[did]}
                  headerText={did}
                  key={index} />;
              })
            }
          </AccountsArea>
        </>
      )}
    </>
  );
}

const AccountsArea = styled.div`
  height: 100%;
  overflow-y: scroll;
  margin-top: -25px;
  padding-top: 25px;
  padding-right: 0px;
  padding-left: 0px;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;
