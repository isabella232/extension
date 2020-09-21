import React, { FC, useState, useContext } from 'react';
import { IdentifiedAccount } from '@polymath/extension-core/types';
import { formatters } from "../../util";
import { Box, Text, TextEllipsis, Flex, Icon, StatusBadge, TextInput } from '../../ui';
import {
  SvgAccount,
  SvgCheckboxMarkedCircle,
  SvgPencilOutline,
  SvgWindowClose,
  SvgCheck,
} from "@polymath/ui/assets/images/icons";
import { editAccount } from "../../messaging";
import { ActionContext } from "../../components";

export interface Props {
  account: IdentifiedAccount;
  isAssigned: boolean;
  isSelected?: boolean;
}

export const AccountView: FC<Props> = ({account, isAssigned, isSelected}) => {
  const { name, address } = account;

  const onAction = useContext(ActionContext);

  const [isEditing, setEditing] = useState(false);
  const [newName, setNewName] = useState(name);

  const renderType = (keyType: string) => {
    const color = keyType === 'primary' ? 'green' : 'blue';
    const text = keyType === 'primary' ? 'Master' : 'Secondary';

    return (
      !isEditing && <StatusBadge variant={color}>{text}</StatusBadge>
    );
  };

  const cancelEditing = () => {
    setEditing(false);
  };

  const editName = () => {
    setEditing(true);
  };

  const handleNameChange = (e) => {
    setNewName(e.target.value);
  };

  const save = () => {
    editAccount(address, newName)
      .then(() => {
        onAction();
        setEditing(false);
      })
      .catch(console.error);
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
              <Text variant="b2m" color="brandMain">{name.substr(0,1)}</Text>
            </Flex>
          </Box>
        </Box>
        <Box ml="s" width="100%">
          <Flex
            justifyContent="space-between"
            flexDirection="row"
          >
            <Flex flexDirection="row">
              {isEditing && (
                <Flex flexDirection="row">
                  <TextInput defaultValue={name} value={newName} onChange={handleNameChange} />
                  <Box ml="xs">
                    <Icon Asset={SvgCheck} width={16} height={16} color="gray.2" onClick={save} />
                  </Box>
                  <Box ml="xs">
                    <Icon Asset={SvgWindowClose} width={16} height={16} color="gray.2" onClick={cancelEditing} />
                  </Box>
                </Flex>
              )}
              {!isEditing && (
                <Flex flexDirection="row">
                  <Text variant="b2m" color="gray.1">
                    {name}
                  </Text>
                  <Box ml="xs">
                    <Icon Asset={SvgPencilOutline} width={16} height={16} color="gray.2" onClick={editName} />
                  </Box>
                </Flex>
              )}
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
                  {address}
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