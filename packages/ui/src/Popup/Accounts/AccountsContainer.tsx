import React, { FC } from 'react';
import { IdentifiedAccount } from '@polymath/extension-core/types';
import { Button } from 'react-aria-menubutton';
import { useHistory } from 'react-router-dom';
import { Box, Text, TextEllipsis, Flex, Icon, Menu, MenuItem, Wrapper } from '../../ui';
import {
  SvgDotsVertical,
  SvgAlertCircle,
} from '@polymath/ui/assets/images/icons';
import { AccountView } from './AccountView';

export interface Props {
  headerText: string;
  accounts: IdentifiedAccount[];
}

export const AccountsContainer: FC<Props> = ({ accounts, headerText }) => {
  const history = useHistory();

  const renderMenuItems = () => {
    return (
      <>
        <MenuItem value="export">Export account</MenuItem>
        <MenuItem value="forget">Forget account</MenuItem>
      </>
    );
  };

  const handleMenuClick = (event: string) => {
    const { address } = accounts[0];

    switch (event) {
      case "export":
        return history.push(`/account/export/${address}`);
      case "forget":
        return history.push(`/account/forget/${address}`);
    }
  };

  const colors = ["#F2E6FF", "#F1FEE1", "#FFEBF1", "#FFEAE1", "#E6F9FE", "#FAF5FF", "#E6FFFA", "#EBF4FF", "#DCEFFE"];

  const renderContainerHeader = (isAssigned: boolean) => {
    if (isAssigned) {
      return (
        <Box borderRadius="2" bg="brandLightest" mx="s" mt="xs" px="s" py="xs">
          <Flex flexDirection="row" justifyContent="space-between">
            <Text variant="c2" color="brandMain">
              <TextEllipsis size="30">{headerText}</TextEllipsis>
            </Text>
            <Box>
              <Flex flexDirection="row">
                {
                  !accounts[0].cdd &&
                    <Box mr="m">
                      <Icon Asset={SvgAlertCircle} width={14} height={14} color="alert" />
                    </Box>
                }
                <Wrapper onSelection={handleMenuClick}>
                  <Button>
                    <Icon Asset={SvgDotsVertical} width={16} height={16} color="gray.1" />
                  </Button>
                  <Menu>{renderMenuItems()}</Menu>
                </Wrapper>
              </Flex>
            </Box>
          </Flex>
        </Box>
      );
    } else {
      return (
        <Box mx="xs">
          <Text variant="c2" color="gray.1">Unassigned keys</Text>
        </Box>
      );
    }
  };

  const renderAccounts = () => {
    return (
      <>
        {accounts.map((account: IdentifiedAccount, index) => {
          return (
            <AccountView account={account}
              isSelected={false}
              key={index}
            />
          );
        })}
      </>
    );
  }

  return (
    <Box boxShadow="3" m="s" borderRadius="2" pt="xs" pb="xs">
      {renderContainerHeader(accounts[0].cdd)}
      {renderAccounts()}
    </Box>
  );
};
