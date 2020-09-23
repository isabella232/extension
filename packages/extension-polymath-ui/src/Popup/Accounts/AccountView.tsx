import React, { FC, useState, useContext } from 'react';
import { IdentifiedAccount } from '@polymath/extension-core/types';
import { formatters } from '../../util';
import { Box, Text, TextEllipsis, Flex, Icon, StatusBadge, TextInput, ButtonSmall } from '../../ui';
import { SvgAccount,
  SvgCheckboxMarkedCircle,
  SvgPencilOutline,
  SvgWindowClose,
  SvgCheck } from '@polymath/extension-ui/assets/images/icons';
import { editAccount } from '../../messaging';
import { ActionContext } from '../../components';

export interface Props {
  account: IdentifiedAccount;
  isSelected?: boolean;
}

export const AccountView: FC<Props> = ({ account, isSelected }) => {
  const { address, balance, did, keyType, name } = account;

  const onAction = useContext(ActionContext);

  const [isEditing, setEditing] = useState(false);
  const [newName, setNewName] = useState(name);
  const [hover, setHover] = useState(false);

  const renderType = (keyType: string) => {
    const color = keyType === 'primary' ? 'green' : 'blue';
    const text = keyType === 'primary' ? 'Master' : 'Secondary';

    return (
      !isEditing && did && <StatusBadge variant={color}>{text}</StatusBadge>
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

  const mouseEnter = () => {
    setHover(true);
  };

  const mouseLeave = () => {
    setHover(false);
  };

  const renderAccountInfo = () => {
    return (
      <>
        <Flex
          flexDirection='row'
          justifyContent='space-between'
        >
          <Flex flexDirection='row'>
            {isEditing && (
              <Flex flexDirection='row'>
                <TextInput defaultValue={name}
                  onChange={handleNameChange}
                  value={newName} />
                <Box ml='xs'>
                  <Icon Asset={SvgCheck}
                    color='gray.2'
                    height={16}
                    onClick={save}
                    width={16} />
                </Box>
                <Box ml='xs'>
                  <Icon Asset={SvgWindowClose}
                    color='gray.2'
                    height={16}
                    onClick={cancelEditing}
                    width={16} />
                </Box>
              </Flex>
            )}
            {!isEditing && (
              <Flex flexDirection='row'>
                <Text color='gray.1'
                  variant='b2m'>
                  {name}
                </Text>
                <Box ml='xs'>
                  <Icon Asset={SvgPencilOutline}
                    color='gray.2'
                    height={16}
                    onClick={editName}
                    width={16} />
                </Box>
              </Flex>
            )}
            <Box ml='s'>
              {renderType(keyType)}
            </Box>
          </Flex>
          {
            isSelected &&
              <Icon Asset={SvgCheck}
                color='brandMain'
                height={24}
                width={24} />
          }
        </Flex>
        <Flex
          flexDirection='row'
          justifyContent='space-between'
        >
          <Box>
            <Text color='gray.3'
              variant='b3'>
              <TextEllipsis size={13}>
                {address}
              </TextEllipsis>
            </Text>
          </Box>
          <Box>
            <Text color='gray.1'
              variant='b3'>
              {formatters.formatAmount(balance, 2, true)} POLYX
            </Text>
          </Box>
        </Flex>
      </>
    );
  };

  const renderHoverAccountInfo = () => {
    return (
      <>
        <Flex
          flexDirection='row'
          justifyContent='space-between'
        >
          <Box>
            <Text color='gray.1'
              variant='b2m'>
              {name}
            </Text>
            <Box>
              <Text color='gray.3'
                variant='b3'>
                <TextEllipsis size={13}>
                  {address}
                </TextEllipsis>
              </Text>
            </Box>
          </Box>
          <Box>
            <ButtonSmall variant='secondary'>Assign</ButtonSmall>
          </Box>
        </Flex>
      </>
    );
  };

  return (
    <Box bg={isSelected ? 'gray.5' : 'gray.0'}
      mt='s'
      onMouseEnter={mouseEnter}
      onMouseLeave={mouseLeave}
      px='s'>
      <Flex justifyContent='space-between'>
        <Box>
          <Box
            backgroundColor='brandLightest'
            borderRadius='50%'
            height={32}
            px='2'
            width={32}
          >
            <Flex justifyContent='center'
              pt='xs'>
              <Text color='brandMain'
                variant='b2m'>{name.substr(0, 1)}</Text>
            </Flex>
          </Box>
        </Box>
        <Box ml='s'
          width='100%'>
          {(!hover || did) && renderAccountInfo()}
          {(hover && !did) && renderHoverAccountInfo()}
        </Box>
      </Flex>
    </Box>
  );
};
