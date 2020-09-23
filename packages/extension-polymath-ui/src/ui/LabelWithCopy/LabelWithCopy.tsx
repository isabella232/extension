import React, { FC, useState } from 'react';
import { SvgContentCopy } from '@polymath/extension-ui/assets/images/icons';
import { Box } from '../Box';
import { Flex } from '../Flex';
import { Icon } from '../Icon';
import { Text } from '../Text';
import { TextEllipsis } from '../TextEllipsis';

export interface Props {
  text: string;
  color: string;
  textSize: number;
  textVariant: 'b1m' | 'b1' | 'b2m' | 'b2' | 'b3m' | 'b3' | 'sh1' | 'c1' | 'c2' | 'c2m';
}

export const LabelWithCopy: FC<Props> = ({ color, text, textSize, textVariant }) => {
  const [hover, setHover] = useState(false);

  const onMouseOver = () => {
    console.log('over');
    setHover(true);
  };

  const onMouseOut = () => {
    console.log('out');
    setHover(true);
  };

  return (
    <Flex
      onMouseOut={onMouseOut}
      onMouseOver={onMouseOver}
    >
      <Box>
        <Text color={color}
          variant={textVariant}>
          <TextEllipsis size={textSize}>
            {text}
          </TextEllipsis>
        </Text>
      </Box>
      {
        hover &&
          <Box ml='xs'>
            <Icon Asset={SvgContentCopy}
              color={color}
              height={16}
              width={16}
            />
          </Box>
      }
    </Flex>
  );
};
