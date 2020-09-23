import React from 'react';
import { Wrapper as ScWrapper } from 'react-aria-menubutton';
import { styled } from '@polymath/extension-ui/styles';

type Props = React.ComponentProps<typeof ScWrapper>;
export interface WrapperProps extends Props {
  onSelection: () => void;
}

export const Wrapper: React.ReactElement<WrapperProps> = styled(ScWrapper)({
  position: 'relative',
  display: 'inline-block'
});
