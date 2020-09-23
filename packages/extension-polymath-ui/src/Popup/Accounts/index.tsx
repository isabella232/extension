// Copyright 2019-2020 @polkadot/extension-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useContext, useState, useEffect } from 'react';
import styled from 'styled-components';

import { AccountContext, Link } from '../../components';
import AddAccount from './AddAccount';
import { Text, Box, Header, TextEllipsis, Flex, Icon, Heading, Button, StatusBadge, LabelWithCopy } from '../../ui';
import { AccountWithChildren } from '@polkadot/extension-base/background/types';
import { SvgCheckboxMarkedCircle,
  SvgAlertCircle,
  SvgViewDashboard,
  SvgDotsVertical,
  SvgPlus } from '@polymath/extension-ui/assets/images/icons';
import { formatters } from '../../util';
import { IdentifiedAccount } from '@polymath/extension/types';
import { AccountsContainer } from './AccountsContainer';

export default function Accounts (): React.ReactElement {
  const [currentAccount, setCurrentAccount] = useState<IdentifiedAccount>();
  const { hierarchy, network, polymeshAccounts, selectedAccount } = useContext(AccountContext);

  useEffect(() => {
    setCurrentAccount(polymeshAccounts.find((account) => (account.address === selectedAccount)));
  },
  [polymeshAccounts, selectedAccount]
  );

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

  console.log('ACCOUNTS', polymeshAccounts);
  console.log('SELECTED ACCOUNT', selectedAccount);

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
            {
              currentAccount?.did &&
              <Box bg='brandLightest'
                borderRadius='2'>
                {currentAccount && (
                  <Flex flexDirection='row'
                    justifyContent='space-between'
                    mx='1'>
                    <Flex flexDirection='row'>
                      {
                        currentAccount.didAlias &&
                        <Box mr='1'>
                          <Text color='brandMain'
                            variant='c2m'>
                            Did Label
                          </Text>
                        </Box>
                      }
                      <Text color='gray.2'
                        variant='c2'>
                        <TextEllipsis size={12}>{currentAccount?.did}</TextEllipsis>
                      </Text>
                    </Flex>
                    {renderStatus(currentAccount.cdd)}
                  </Flex>
                )}
              </Box>
            }
            {
              !currentAccount?.did &&
                <Text color='brandLighter'
                  variant='b2m'>Unassigned key</Text>
            }
            <Flex flexDirection='row'
              mt='s'>
              <Text color='gray.0'
                variant='b1m'>
                {currentAccount?.name}
              </Text>
            </Flex>
            <Box>
              <LabelWithCopy color='gray.0'
                text={currentAccount?.address || ''}
                textSize={30}
                textVariant='b3'
              />
            </Box>
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
                    View details
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
                return <AccountsContainer
                  accounts={groupedAccounts[did]}
                  headerText={did}
                  key={index}
                  selectedAccount={selectedAccount || ''}
                />;
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
