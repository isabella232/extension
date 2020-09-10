import React, { FC } from "react";
import { Menu as ScMenu } from "react-aria-menubutton";
import { styled } from "@polkadot/ui/styles";

export interface MenuProps {
  onSelection: () => void;
}

export const Menu = styled(ScMenu)({
  background: "#fff",
  border: "1px solid #ccc",
  listStyleType: "none",
  paddingLeft: 0,
  position: "absolute",
  top: "100%",
  left: -180,
  zIndex: 99,
  margin: "2px 0 0 0",
  width: "220px",
  maxWidth: "200px",
  "&:before": {
    border: "inset 6px",
    content: "",
    display: "block",
    height: 0,
    width: 0,
    borderColor: "rgba(0, 0, 0, 0) rgba(0, 0, 0, 0) #fff rgba(0, 0, 0, 0)",
    borderBottomStyle: "solid",
    position: "absolute",
    top: "-12px",
    left: "-12px",
    zIndex: 89,
  },
  "&:after": {
    border: "inset 7px",
    content: "",
    display: "block",
    height: 0,
    width: 0,
    borderColor: "rgba(0, 0, 0, 0) rgba(0, 0, 0, 0) #ccc rgba(0, 0, 0, 0)",
    borderBottomStyle: "solid",
    position: "absolute",
    top: "-14px",
    left: "1px",
    zIndex: 88,
  },
});
