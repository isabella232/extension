import styled from "styled-components";
import { Box } from "../Box";

export const Header = styled(Box)({
  paddingTop: ({ theme }) => theme.space.xs,
  paddingBottom: ({ theme }) => theme.space.m,
  paddingLeft: ({ theme }) => theme.space.s,
  paddingRight: ({ theme }) => theme.space.s,
  backgroundImage: "linear-gradient(to right, #170087, #1813E4)",
});
