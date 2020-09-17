import React, { FC, useState, useContext } from "react";
import { Box, Text, Flex, TextEllipsis, Icon, Wrapper, Menu, MenuItem, TextInput } from "../../ui";
import { AccountJson } from "@polkadot/extension-base/background/types";
import {
  SvgAccount,
  SvgCheck,
  SvgCheckboxMarkedCircle,
  SvgDotsVertical,
  SvgWindowClose,
  SvgAlertCircle,
} from "@polymath/ui/assets/images/icons";
import { editAccount } from "../../messaging";
import { Button } from "react-aria-menubutton";
import { useHistory } from "react-router-dom";
import { formatters } from "../../util";
import { ActionContext } from "../../components";

const colors = ["#F2E6FF", "#F1FEE1", "#FFEBF1", "#FFEAE1", "#E6F9FE", "#FAF5FF", "#E6FFFA", "#EBF4FF", "#DCEFFE"];

export interface Props extends AccountJson {
  className?: string;
  parentName?: string;
  selectAccount: (accountAddress: string) => void;
}

export const AccountView: FC<Props> = (props) => {
  const { did, isExternal, name, address, balance, isHidden, selectAccount } = props;
  const history = useHistory();
  const [isEditing, setEditing] = useState(false);
  const [newName, setNewName] = useState(name);
  const onAction = useContext(ActionContext);

  const stringToColor = (str: string) => {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let colorIndex = (hash >> 8) & 0xf;
    if (colorIndex >= colors.length) {
      colorIndex = colorIndex - colors.length;
    }
    return colors[colorIndex];
  };

  const handleMenuClick = (event) => {
    console.log("click", event);
    switch (event) {
      case "select":
        return selectAccount(address);
      case "derive":
        return history.push(`/account/derive/${address}/locked`);
      case "export":
        return history.push(`/account/export/${address}`);
      case "forget":
        return history.push(`/account/forget/${address}`);
      case "rename":
        return setEditing(true);
    }
  };

  const cancelEditing = () => {
    setEditing(false);
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

  const renderMenuItems = () => {
    return (
      <>
        <MenuItem value="select">Select</MenuItem>
        <MenuItem value="rename">Rename</MenuItem>
        {!isExternal && <MenuItem value="derive">Derive new account</MenuItem>}
        <MenuItem value="export">Export account</MenuItem>
        <MenuItem value="forget">Forget account</MenuItem>
      </>
    );
  };

  const renderStatus = (isVerified: boolean) => {
    const color = isVerified ? "success" : "alert";
    const iconAsset = isVerified ? SvgCheckboxMarkedCircle : SvgAlertCircle;

    return <Icon Asset={iconAsset} width={14} height={14} color={color} />;
  };

  return (
    <Box boxShadow="3" m="s" borderRadius="2" pt="s" pb="s">
      <Box borderRadius="2" bg={stringToColor(address)} mx="s">
        <Flex flexDirection="row" justifyContent="space-between">
          <Flex flexDirection="row" px="1">
            <Text color="brandMain" variant="c2">
              Did Label
            </Text>
            <Box mx="1">
              <Text color="gray.2" variant="c2">
                <TextEllipsis size="12">{did}</TextEllipsis>
              </Text>
            </Box>
          </Flex>
          <Flex flexDirection="row" justifyContent="space-between">
            <Box mr="1">{renderStatus(false)}</Box>
            <Box mr="1">
              <Wrapper onSelection={handleMenuClick}>
                <Button>
                  <Icon Asset={SvgDotsVertical} width={16} height={16} color="gray.1" />
                </Button>
                <Menu>{renderMenuItems()}</Menu>
              </Wrapper>
            </Box>
          </Flex>
        </Flex>
      </Box>
      <Box mt="s" bg={isHidden ? "gray.0" : "gray.5"} px="s">
        <Flex flexDirection="row" justifyContent="space-between">
          <Flex flexDirection="row">
            <Box px="2" borderRadius="50%" width={32} height={32} backgroundColor="brandLightest">
              <Icon Asset={SvgAccount} width={14} height={14} color="brandMain" />
            </Box>
            <Box ml="s">
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
                <Text variant="b2m" color="gray.1">
                  {name}
                </Text>
              )}

              <Box>
                <Text variant="b3" color="gray.3">
                  {formatters.formatAmount(balance, 2, true)} POLYX
                </Text>
              </Box>
            </Box>
          </Flex>
          <Box>{!isHidden && <Icon Asset={SvgCheck} width={24} height={24} color="brandMain" />}</Box>
        </Flex>
      </Box>
    </Box>
  );
};
