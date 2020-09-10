import React, { FC } from "react";
import { Box, Text, Flex, TextEllipsis, Icon, Wrapper, Menu, MenuItem } from "../../ui";
import { AccountJson } from "@polkadot/extension-base/background/types";
import { SvgAccount, SvgCheck, SvgCheckboxMarkedCircle, SvgDotsVertical } from "@polkadot/ui/assets/images/icons";
import { Button } from "react-aria-menubutton";

export interface Props extends AccountJson {
  className?: string;
  parentName?: string;
  selectAccount: (accountAddress: string) => void;
}

export const AccountView: FC<Props> = (props) => {
  const { className, parentName, name, address, balance, isHidden, selectAccount } = props;
  console.log("PROPS", props);

  const handleMenuClick = (event) => {
    console.log("click", event);
    switch (event) {
      case "select":
        return selectAccount(address);
    }
  };

  const renderMenuItems = () => {
    return (
      <>
        <MenuItem value="select">Select</MenuItem>
        <MenuItem value="rename">Rename</MenuItem>
        <MenuItem value="derive">Derive new account</MenuItem>
        <MenuItem value="export">Export account</MenuItem>
        <MenuItem value="forget">Forget account</MenuItem>
      </>
    );
  };

  return (
    <Box boxShadow="3" m="s" borderRadius="2" pt="s" pb="s">
      <Box borderRadius="2" bg="brandLightest" mx="s">
        <Flex flexDirection="row" justifyContent="space-between">
          <Flex flexDirection="row" p="1">
            <Text color="brandMain" variant="c2">
              {name}
            </Text>
            <Box mx="1">
              <Text color="gray.2" variant="c2">
                <TextEllipsis size="12">{address}</TextEllipsis>
              </Text>
            </Box>
          </Flex>
          <Flex flexDirection="row" justifyContent="space-between">
            <Box mr="1">
              <Icon Asset={SvgCheckboxMarkedCircle} width={16} height={16} color="success" />
            </Box>
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
      <Box mt="s" py="s" bg="gray.5" px="s">
        <Flex flexDirection="row" justifyContent="space-between">
          <Flex flexDirection="row">
            <Box px="2" borderRadius="50%" width={32} height={32} backgroundColor="brandLightest">
              <Icon Asset={SvgAccount} width={14} height={14} color="brandMain" />
            </Box>
            <Box ml="s">
              <Box>
                <Text variant="b2m" color="gray.1">
                  {name}
                </Text>
              </Box>
              <Box>
                <Text variant="b3" color="gray.3">
                  {balance} POLYX
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
