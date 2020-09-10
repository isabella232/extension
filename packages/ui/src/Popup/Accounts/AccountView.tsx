import React, { FC } from "react";
import { Box, Text, Flex } from "../../ui";
import { AccountJson } from "@polkadot/extension-base/background/types";

export interface Props extends AccountJson {
  className?: string;
  parentName?: string;
}

export const AccountView: FC<Props> = (props) => {
  const { className, parentName, name, address } = props;
  console.log("PROPS", className, parentName, name);
  return (
    <Box boxShadow="3" p="s" m="s" borderRadius="2">
      <Box borderRadius="2" bg="brandLightest">
        <Flex flexDirection="row">
          <Text color="brandMain" variant="c2">
            {name}
          </Text>
          <Text color="gray.2" variant="c2">
            {address}
          </Text>
        </Flex>
      </Box>
    </Box>
  );
};
