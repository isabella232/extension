// Copyright 2019-2020 @polkadot/extension-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountJson, AccountWithChildren } from "@polkadot/extension-base/background/types";
import { Chain } from "@polkadot/extension-chains/types";
import { SettingsStruct } from "@polkadot/ui-settings/types";
import { ThemeProps } from "../types";

import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import styled from "styled-components";
import { decodeAddress, encodeAddress } from "@polkadot/util-crypto";

import copyIcon from "../assets/copy.svg";
import hiddenIcon from "../assets/hidden.svg";
import details from "../assets/details.svg";
import parentArrow from "../assets/arrowParentLabel.svg";
import { AccountContext, SettingsContext } from "./contexts";
import useOutsideClick from "../hooks/useOutsideClick";
import useMetadata from "../hooks/useMetadata";
import useToast from "../hooks/useToast";
import Identicon from "./Identicon";
import Menu from "./Menu";
import Svg from "./Svg";

interface Props {
  actions?: React.ReactNode;
  address?: string | null;
  children?: React.ReactNode;
  className?: string;
  genesisHash?: string | null;
  isHidden?: boolean;
  name?: React.ReactNode | null;
  parentName?: string | null;
  suri?: string;
  balance?: number;
  did?: string;
  toggleActions?: number;
}

interface Recoded {
  account: AccountJson | null;
  formatted: string | null;
  prefix: number;
}

// find an account in our list
function findAccount(accounts: AccountJson[], publicKey: Uint8Array): AccountJson | null {
  const pkStr = publicKey.toString();

  return accounts.find(({ address }): boolean => decodeAddress(address).toString() === pkStr) || null;
}

// recodes an supplied address using the prefix/genesisHash, include the actual saved account & chain
function recodeAddress(
  address: string,
  accounts: AccountWithChildren[],
  chain: Chain | null,
  settings: SettingsStruct
): Recoded {
  // decode and create a shortcut for the encoded address
  const publicKey = decodeAddress(address);

  // find our account using the actual publicKey, and then find the associated chain
  const account = findAccount(accounts, publicKey);
  const prefix = chain ? chain.ss58Format : settings.prefix === -1 ? 42 : settings.prefix;

  // always allow the actual settings to override the display
  return {
    account,
    formatted: encodeAddress(publicKey, prefix),
    prefix,
  };
}

const ACCOUNTS_SCREEN_HEIGHT = 550;

function Address({
  actions,
  address,
  balance,
  children,
  className,
  did,
  genesisHash,
  isHidden,
  name,
  parentName,
  suri,
  toggleActions,
}: Props): React.ReactElement<Props> {
  const { accounts } = useContext(AccountContext);
  const settings = useContext(SettingsContext);
  const chain = useMetadata(genesisHash, true);
  const [{ account, formatted, prefix }, setRecoded] = useState<Recoded>({
    account: null,
    formatted: null,
    prefix: 42,
  });
  const [showActionsMenu, setShowActionsMenu] = useState(false);
  const [moveMenuUp, setIsMovedMenu] = useState(false);
  const actionsRef = useRef<HTMLDivElement>(null);
  const { show } = useToast();

  useOutsideClick(actionsRef, () => showActionsMenu && setShowActionsMenu(!showActionsMenu));

  useEffect((): void => {
    address && setRecoded(recodeAddress(address, accounts, chain, settings));
  }, [accounts, address, chain, settings]);

  useEffect(() => {
    if (!showActionsMenu) {
      setIsMovedMenu(false);
    } else if (actionsRef.current) {
      const { bottom } = actionsRef.current.getBoundingClientRect();

      if (bottom > ACCOUNTS_SCREEN_HEIGHT) {
        setIsMovedMenu(true);
      }
    }
  }, [showActionsMenu]);

  useEffect((): void => {
    setShowActionsMenu(false);
  }, [toggleActions]);

  const theme = ((chain && chain.icon) || "polkadot") as "polkadot";
  const _onClick = useCallback((): void => setShowActionsMenu(!showActionsMenu), [showActionsMenu]);
  const _onCopy = useCallback((): void => show("Copied"), [show]);

  let displayedName = name || (account && account.name) || "<unknown>";
  const balanceStr = balance !== undefined ? (balance / 1000000).toString() : "";

  displayedName += ` (${balanceStr} PolyX)`;

  return (
    <div className={className}>
      <div className="infoRow">
        <Identicon
          className="identityIcon"
          iconTheme={theme}
          onCopy={_onCopy}
          prefix={prefix}
          value={formatted || address}
        />
        <div className="info">
          {parentName ? (
            <>
              <div className="banner">
                <ArrowLabel />
                <div className="parentName" data-field="parent">
                  {parentName}&nbsp;&nbsp;{suri || ""}
                </div>
              </div>
              <div className="name displaced">{displayedName}</div>
            </>
          ) : (
            <div className="name" data-field="name">
              {displayedName}
            </div>
          )}
          {chain?.genesisHash && (
            <div
              className="banner chain"
              data-field="chain"
              style={chain.definition.color ? { backgroundColor: chain.definition.color } : undefined}
            >
              {chain.name}
            </div>
          )}
          <div className="addressDisplay">
            <FullAddress data-field="address">{formatted || "<unknown>"}</FullAddress>
            <CopyToClipboard text={(formatted && formatted) || ""}>
              <Svg onClick={_onCopy} src={copyIcon} />
            </CopyToClipboard>
            {isHidden && <Svg className="hiddenIcon" src={hiddenIcon} />}
          </div>
          {did && (
            <div className="addressDisplay">
              <FullAddress data-field="address">{"DID: " + did}</FullAddress>
            </div>
          )}
        </div>
        {actions && (
          <>
            <Settings onClick={_onClick}>{showActionsMenu ? <ActiveActionsIcon /> : <ActionsIcon />}</Settings>
            {showActionsMenu && (
              <MovableMenu isMoved={moveMenuUp} reference={actionsRef}>
                {actions}
              </MovableMenu>
            )}
          </>
        )}
      </div>
      {children}
    </div>
  );
}

const FullAddress = styled.div(
  ({ theme }: ThemeProps) => `
  width: 270px;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${theme.labelColor};
  font-size: 12px;
  line-height: 16px;
`
);

FullAddress.displayName = "FullAddress";

const Settings = styled.div(
  ({ theme }: ThemeProps) => `
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 40px;

  & ${Svg} {
    width: 3px;
    height: 19px;
  }

  &:before {
    content: '';
    position: absolute;
    left: 0;
    top: 25%;
    bottom: 25%;
    width: 1px;
    background: ${theme.boxBorderColor};
  }

  &:hover {
    cursor: pointer;
    background: ${theme.readonlyInputBackground};
  }
`
);

Settings.displayName = "Details";

const ActionsIcon = styled(Svg).attrs(() => ({ src: details }))`
  background: ${({ theme }: ThemeProps): string => theme.accountDotsIconColor};
`;

const ActiveActionsIcon = styled(Svg).attrs(() => ({ src: details }))`
  background: ${({ theme }: ThemeProps): string => theme.primaryColor};
`;

const ArrowLabel = styled(Svg).attrs(() => ({ src: parentArrow }))`
  background: ${({ theme }: ThemeProps): string => theme.labelColor};
  position: absolute;
  top: 5px;
  width: 9px;
  height: 9px;
`;

const MovableMenu = styled(Menu)<{ isMoved: boolean }>`
  ${({ isMoved }): string => (isMoved ? "bottom: 0;" : "top: 0;")}
  margin-top: -20px;
  right: 28px;
`;

export default styled(Address)(
  ({ theme }: ThemeProps) => `
  background: ${theme.accountBackground};
  border: 1px solid ${theme.boxBorderColor};
  box-sizing: border-box;
  border-radius: 4px;
  margin-bottom: 8px;
  position: relative;

  .banner {
    font-size: 12px;
    line-height: 16px;
    position: absolute;
    top: 0;

    &.chain {
      background: ${theme.primaryColor};
      border-radius: 0 0 0 10px;
      color: white;
      padding: 0.1rem 0.5rem 0.1rem 0.75rem;
      right: 0;
      z-index: 1;
    }
  }

  .addressDisplay {
    display: flex;
    justify-content: space-between;
    position: relative;

    & ${Svg} {
      width: 14px;
      height: 14px;
      margin-right: 10px;
      background: ${theme.accountDotsIconColor};
      &:hover {
        background: ${theme.labelColor};
        cursor: pointer;
      }
    }

    .hiddenIcon {
      position: absolute;
      right: 2px;
      top: -18px;
    }
  }

  .identityIcon {
    margin-left: 15px;
    margin-right: 10px;

    & svg {
      width: 50px;
      height: 50px;
    }
  }

  .info {
    width: 100%;
  }

  .infoRow {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    height: 72px;
    border-radius: 4px;
  }

  .name {
    font-size: 16px;
    font-weight: 600;
    line-height: 22px;
    margin: 2px 0;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 300px;

    &.displaced {
      padding-top: 10px;
    }
  }

  .parentName {
    color: ${theme.labelColor};
    font-size: 10px;
    font-weight: 600;
    line-height: 14px;
    overflow: hidden;
    padding: 0.25rem 0 0 0.8rem;
    text-overflow: ellipsis;
    width: 270px;
  }
`
);
