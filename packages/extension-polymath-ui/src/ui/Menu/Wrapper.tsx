import React from 'react';
import { Wrapper as ScWrapper } from 'react-aria-menubutton';
import { styled } from '@polymath/extension-ui/styles';

export interface WrapperProps {
  onSelection: () => void;
}

export const Wrapper = styled(ScWrapper)({
  position: 'relative',
  display: 'inline-block'
});
