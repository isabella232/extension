// Copyright 2019-2020 @polkadot/extension-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useContext } from "react";
import styled from "styled-components";

import { AccountContext } from "../../components";
import AccountsTree from "./AccountsTree";
import AddAccount from "./AddAccount";
import { Text, Box, Header } from "../../ui";
import { showAccount } from "../../messaging";
import { AccountWithChildren } from "@polkadot/extension-base/background/types";

export default function Accounts(): React.ReactElement {
  const { hierarchy } = useContext(AccountContext);

  console.log("ACCOUNTS", hierarchy);

  const select = (accounts: AccountWithChildren[], selectedAccount: string) => {
    accounts.map((account) => {
      showAccount(account.address, account.address === selectedAccount).catch(console.error);
      if (account.children) {
        select(account.children, selectedAccount);
      }
    });
  };

  const selectAccount = (accountAddress: string) => {
    console.log("ACCOUN SELECTED", accountAddress);
    select(hierarchy, accountAddress);
  };

  return (
    <>
      {hierarchy.length === 0 ? (
        <AddAccount />
      ) : (
        <>
          <Header>Accounts</Header>
          <AccountsArea>
            <Box px="s">
              <Text variant="c2" color="gray.1">
                ACCOUNTS
              </Text>
            </Box>
            {hierarchy.map(
              (json, index): React.ReactNode => (
                <AccountsTree {...json} key={`${index}:${json.address}`} selectAccount={selectAccount} />
              )
            )}
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
