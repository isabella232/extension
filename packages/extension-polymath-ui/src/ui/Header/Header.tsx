import styled from 'styled-components';
import { Box } from '../Box';

export const Header = styled(Box)({
  paddingTop: ({ theme }: { theme: any }) => theme.space.xs,
  paddingBottom: ({ theme }: { theme: any }) => theme.space.m,
  paddingLeft: ({ theme }: { theme: any }) => theme.space.s,
  paddingRight: ({ theme }: { theme: any }) => theme.space.s,
  backgroundImage: 'linear-gradient(to right, #170087, #1813E4)'
});
