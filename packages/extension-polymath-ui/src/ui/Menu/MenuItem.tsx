import React, { FC } from 'react';
import { MenuItem as ScMenuItem } from 'react-aria-menubutton';
import { styled } from '@polymath/extension-ui/styles';

export interface MenuProps {
  onSelection: () => void;
}

export const MenuItem = styled(ScMenuItem)({
  cursor: 'pointer',
  color: '#555',
  padding: '0.5rem',
  '&:hover': {
    background: '#eee'
  },
  '&:focus': {
    background: '#eee'
  },
  '&:after': {
    content: '',
    display: 'table',
    clear: 'both'
  }
});
