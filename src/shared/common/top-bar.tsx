import { styled, Theme } from "onefx/lib/styletron-react";
import { assetURL } from "onefx/lib/asset-url";
import { t } from "onefx/lib/iso-i18n";
import React, { useEffect, useState } from "react";
import OutsideClickHandler from "react-outside-click-handler";
import { CommonMargin } from "./common-margin";
import { Icon } from "./icon";
import { Cross } from "./icons/cross.svg";
import { Hamburger } from "./icons/hamburger.svg";
import { transition } from "./styles/style-animation";
import { colors } from "./styles/style-color";
import { media, PALM_WIDTH } from "./styles/style-media";
import { contentPadding, maxContentWidth } from "./styles/style-padding";

export const TOP_BAR_HEIGHT = 52;

export const TopBar = (): JSX.Element => {
  const [displayMobileMenu, setDisplayMobileMenu] = useState(false);

  useEffect(() => {
    window.addEventListener("resize", () => {
      if (
        document.documentElement &&
        document.documentElement.clientWidth > PALM_WIDTH
      ) {
        setDisplayMobileMenu(false);
      }
    });
  }, []);

  const hideMobileMenu = (): void => {
    setDisplayMobileMenu(false);
  };

  const renderMenu = (): JSX.Element => (
    <>
      <A href="/" key={0} onClick={hideMobileMenu}>
        {t("topbar.home")}
      </A>
    </>
  );

  const renderMobileMenu = (): JSX.Element | null => {
    if (!displayMobileMenu) {
      return null;
    }

    return (
      <OutsideClickHandler onOutsideClick={hideMobileMenu}>
        <Dropdown>{renderMenu()}</Dropdown>
      </OutsideClickHandler>
    );
  };

  return (
    <div>
      <Bar>
        <MaxWidth>
          <Flex>
            <Logo />
            <CommonMargin />
            <BrandText href="/">{t("topbar.brand")}</BrandText>
          </Flex>
          <Flex>
            <Menu>{renderMenu()}</Menu>
          </Flex>
          <HamburgerBtn
            displayMobileMenu={displayMobileMenu}
            onClick={() => {
              setDisplayMobileMenu(true);
            }}
          >
            <Hamburger />
          </HamburgerBtn>
          <CrossBtn displayMobileMenu={displayMobileMenu}>
            <Cross />
          </CrossBtn>
        </MaxWidth>
      </Bar>
      <BarPlaceholder />
      {renderMobileMenu()}
    </div>
  );
};

const MaxWidth = styled("div", () => ({
  display: "flex",
  flexDirection: "row",
  ...maxContentWidth,
  justifyContent: "space-between",
  alignItems: "center",
}));

const Bar = styled("nav", ({ $theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  lineHeight: `${TOP_BAR_HEIGHT}px`,
  height: `${TOP_BAR_HEIGHT}px`,
  backgroundColor: $theme.colors.nav01,
  color: $theme.colors.textReverse,
  position: "fixed",
  top: "0px",
  left: "0px",
  "z-index": "70",
  ...contentPadding,
  boxSizing: "border-box",
}));

const BarPlaceholder = styled("div", () => {
  const height = TOP_BAR_HEIGHT / 2;
  return {
    display: "block",
    padding: `${height}px ${height}px ${height}px ${height}px`,
    backgroundColor: colors.nav01,
  };
});

function HamburgerBtn({
  displayMobileMenu,
  children,
  onClick,
}: {
  displayMobileMenu: boolean;
  children: Array<JSX.Element> | JSX.Element;
  onClick: () => void;
}): JSX.Element {
  const Styled = styled("div", {
    ":hover": {
      color: colors.primary,
    },
    display: "none!important",
    [media.palm]: {
      display: "flex!important",
      ...(displayMobileMenu ? { display: "none!important" } : {}),
    },
    cursor: "pointer",
    justifyContent: "center",
  });
  return <Styled onClick={onClick}>{children}</Styled>;
}

function CrossBtn({
  displayMobileMenu,
  children,
}: {
  displayMobileMenu: boolean;
  children: Array<JSX.Element> | JSX.Element;
}): JSX.Element {
  const Styled = styled("div", {
    ":hover": {
      color: colors.primary,
    },
    display: "none!important",
    [media.palm]: {
      display: "none!important",
      ...(displayMobileMenu ? { display: "flex!important" } : {}),
    },
    cursor: "pointer",
    justifyContent: "center",
    padding: "5px",
  });
  return <Styled>{children}</Styled>;
}

const LogoWrapper = styled("a", {
  width: `${TOP_BAR_HEIGHT}px`,
  height: `${TOP_BAR_HEIGHT}px`,
});

function Logo(): JSX.Element {
  return (
    <LogoWrapper href="/">
      <Icon url={assetURL("favicon.svg")} />
    </LogoWrapper>
  );
}

const A = styled("a", ({ $theme }: { $theme: Theme }) => ({
  color: $theme.colors.textReverse,
  marginLeft: "14px",
  textDecoration: "none",
  ":hover": {
    color: $theme.colors.primary,
  },
  transition,
  fontWeight: "bold",
  [media.palm]: {
    boxSizing: "border-box",
    width: "100%",
    padding: "16px 0 16px 0",
    borderBottom: "1px #EDEDED solid",
  },
}));

const BrandText = styled("a", ({ $theme }) => ({
  color: $theme.colors.textReverse,
  textDecoration: "none",
  ":hover": {
    color: $theme.colors.primary,
  },
  transition,
  fontWeight: "bold",
  marginLeft: 0,
}));

const Flex = styled("div", () => ({
  flexDirection: "row",
  display: "flex",
  boxSizing: "border-box",
}));

const Menu = styled("div", {
  display: "flex!important",
  [media.palm]: {
    display: "none!important",
  },
});

const Dropdown = styled("div", {
  backgroundColor: colors.nav01,
  display: "flex",
  flexDirection: "column",
  ...contentPadding,
  position: "fixed",
  top: TOP_BAR_HEIGHT,
  "z-index": "1",
  width: "100vw",
  height: "100vh",
  alignItems: "flex-end!important",
  boxSizing: "border-box",
});
