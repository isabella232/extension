import React, { FC } from 'react';
import { IdentifiedAccount } from '@polymath/extension-core/types';
import { formatters } from "../../util";
import { Box, Text, TextEllipsis, Flex, Icon, StatusBadge } from '../../ui';
import {
  SvgAccount,
  SvgCheck,
  SvgCheckboxMarkedCircle,
  SvgDotsVertical,
  SvgWindowClose,
  SvgAlertCircle,
} from "@polymath/ui/assets/images/icons";

export interface Props {
  account: IdentifiedAccount;
  isAssigned: boolean;
  isSelected?: boolean;
}

export const AccountView: FC<Props> = ({account, isAssigned, isSelected}) => {
  const renderType = (keyType: string) => {
    const color = keyType === 'primary' ? 'green' : 'blue';
    const text = keyType === 'primary' ? 'Master' : 'Secondary';

    return (
      <StatusBadge variant={color}>{text}</StatusBadge>
    );
  };

  return (
    <Box mt="s" bg={isSelected ? "gray.5" : "gray.0"} px="s">
      <Flex justifyContent="space-between">
        <Box>
          <Box
            backgroundColor="brandLightest"
            borderRadius="50%"
            height={32}
            px="2"
            width={32}
          >
            <Flex justifyContent="center" pt="xs">
              <Text variant="b2m" color="brandMain">{account.name.substr(0,1)}</Text>
            </Flex>
          </Box>
        </Box>
        <Box ml="s" width="100%">
          <Flex
            justifyContent="space-between"
            flexDirection="row"
          >
            <Flex flexDirection="row">
              <Text variant="b2m" color="gray.1">
                {account.name}
              </Text>
              <Box ml="s">
                {renderType(account.keyType)}
              </Box>
            </Flex>
            <Icon Asset={SvgCheck} width={24} height={24} color="brandMain" />
          </Flex>
          <Flex
            flexDirection="row"
            justifyContent="space-between"
          >
            <Box>
              <Text variant="b3" color="gray.3">
                <TextEllipsis size={13}>
                  {account.address}
                </TextEllipsis>
              </Text>
            </Box>
            <Box>
              <Text variant="b3" color="gray.1">
                {formatters.formatAmount(account.balance, 2, true)} POLYX
              </Text>
            </Box>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
}