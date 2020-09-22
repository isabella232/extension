import React, { FC, useState, useContext } from 'react';
import { Box, Text, Flex, TextEllipsis, Icon, Wrapper, Menu, MenuItem, TextInput } from '../../ui';
import { AccountJson } from '@polkadot/extension-base/background/types';
import { SvgAccount,
  SvgCheck,
  SvgCheckboxMarkedCircle,
  SvgDotsVertical,
  SvgWindowClose,
  SvgAlertCircle } from '@polymath/extension-ui/assets/images/icons';
import { editAccount } from '../../messaging';
import { Button } from 'react-aria-menubutton';
import { useHistory } from 'react-router-dom';
import { formatters } from '../../util';
import { ActionContext } from '../../components';

const colors = ['#F2E6FF', '#F1FEE1', '#FFEBF1', '#FFEAE1', '#E6F9FE', '#FAF5FF', '#E6FFFA', '#EBF4FF', '#DCEFFE'];

export interface Props extends AccountJson {
  className?: string;
  parentName?: string;
  selectAccount: (accountAddress: string) => void;
}

export const AccountView: FC<Props> = (props) => {
  const { address, balance, did, isExternal, isHidden, name, selectAccount } = props;
  const history = useHistory();
  const [isEditing, setEditing] = useState(false);
  const [newName, setNewName] = useState(name);
  const onAction = useContext(ActionContext);

  const stringToColor = (str: string) => {
    let hash = 0;

    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    let colorIndex = (hash >> 8) & 0xf;

    if (colorIndex >= colors.length) {
      colorIndex = colorIndex - colors.length;
    }

    return colors[colorIndex];
  };

  const handleMenuClick = (event: any) => {
    console.log('click', event);

    switch (event) {
      case 'select':
        return selectAccount(address);
      case 'derive':
        return history.push(`/account/derive/${address}/locked`);
      case 'export':
        return history.push(`/account/export/${address}`);
      case 'forget':
        return history.push(`/account/forget/${address}`);
      case 'rename':
        return setEditing(true);
    }
  };

  const cancelEditing = () => {
    setEditing(false);
  };

  const handleNameChange = (e: any) => {
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

  const renderMenuItems = () => {
    return (
      <>
        <MenuItem value='select'>Select</MenuItem>
        <MenuItem value='rename'>Rename</MenuItem>
        {!isExternal && <MenuItem value='derive'>Derive new account</MenuItem>}
        <MenuItem value='export'>Export account</MenuItem>
        <MenuItem value='forget'>Forget account</MenuItem>
      </>
    );
  };

  const renderStatus = (isVerified: boolean) => {
    const color = isVerified ? 'success' : 'alert';
    const iconAsset = isVerified ? SvgCheckboxMarkedCircle : SvgAlertCircle;

    return <Icon Asset={iconAsset}
      color={color}
      height={14}
      width={14} />;
  };

  return (
    <Box borderRadius='2'
      boxShadow='3'
      m='s'
      pb='s'
      pt='s'>
      <Box bg={stringToColor(address)}
        borderRadius='2'
        mx='s'>
        <Flex flexDirection='row'
          justifyContent='space-between'>
          <Flex flexDirection='row'
            px='1'>
            <Text color='brandMain'
              variant='c2'>
              Did Label
            </Text>
            <Box mx='1'>
              <Text color='gray.2'
                variant='c2'>
                <TextEllipsis size={12}>{did}</TextEllipsis>
              </Text>
            </Box>
          </Flex>
          <Flex flexDirection='row'
            justifyContent='space-between'>
            <Box mr='1'>{renderStatus(false)}</Box>
            <Box mr='1'>
              <Wrapper onSelection={handleMenuClick}>
                <Button>
                  <Icon Asset={SvgDotsVertical}
                    color='gray.1'
                    height={16}
                    width={16} />
                </Button>
                <Menu>{renderMenuItems()}</Menu>
              </Wrapper>
            </Box>
          </Flex>
        </Flex>
      </Box>
      <Box bg={isHidden ? 'gray.0' : 'gray.5'}
        mt='s'
        px='s'>
        <Flex flexDirection='row'
          justifyContent='space-between'>
          <Flex flexDirection='row'>
            <Box backgroundColor='brandLightest'
              borderRadius='50%'
              height={32}
              px='2'
              width={32}>
              <Icon Asset={SvgAccount}
                color='brandMain'
                height={14}
                width={14} />
            </Box>
            <Box ml='s'>
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
                <Text color='gray.1'
                  variant='b2m'>
                  {name}
                </Text>
              )}

              <Box>
                <Text color='gray.3'
                  variant='b3'>
                  {formatters.formatAmount(balance, 2, true)} POLYX
                </Text>
              </Box>
            </Box>
          </Flex>
          <Box>{!isHidden && <Icon Asset={SvgCheck}
            color='brandMain'
            height={24}
            width={24} />}</Box>
        </Flex>
      </Box>
    </Box>
  );
};
