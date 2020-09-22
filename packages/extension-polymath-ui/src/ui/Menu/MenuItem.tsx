import React from 'react';
import { MenuItem as ScMenuItem } from 'react-aria-menubutton';
import { styled } from '../../styles';

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
