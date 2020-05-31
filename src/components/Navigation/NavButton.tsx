import React, { ReactElement } from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

export const StyledNavLink = styled(NavLink).withConfig({
  shouldForwardProp: (prop, defaultValidatorFn) =>
    !['center', 'active'].includes(prop),
})<{
  active?: boolean;
}>`
  align-items: center;
  color: ${(props) => props.theme.color.navigationText};
  display: flex;
  font-size: 14px;
  padding: 16px 10px;
  text-decoration: none;
  border-radius: 40px;
  margin: 8px;

  svg {
    fill: ${(props) => props.theme.color.navigationText};
    height: 1.39em;
    width: 1.39em;

    margin: 0px 12px 0px 12px;
  }

  &.active {
    background-color: ${(props) => props.theme.color.navigationActive};
  }

  &:hover {
    color: ${(props) => props.theme.color.navigationText};
    background-color: ${(props) => props.theme.color.navigationHover};
  }

  ${(props) =>
    !props.active &&
    `
  opacity: 0.25;
  pointer-events: none;
  `}
`;

export const LogoutNavLink = styled(StyledNavLink)`
  margin: 32px 16px 16px 32px;
  &:hover {
    background-color: ${(props) => props.theme.color.navigationBackground};
  }
`;
export const NavButton: React.FC<{
  to: string;
  icon?: ReactElement;
  center?: boolean;
  active?: boolean;
  onClick?: () => void;
}> = ({ to, icon, children, center = false, active = true, onClick }) => {
  return (
    <StyledNavLink to={to} active={active} onClick={onClick}>
      {icon}
      {children}
    </StyledNavLink>
  );
};

export const NavActionButton: React.FC<{
  icon?: ReactElement;
  onClick: () => void;
  active?: boolean;
}> = ({ icon, onClick, children, active = true }) => (
  <LogoutNavLink as="button" onClick={onClick} active={active}>
    {icon}
    {children}
  </LogoutNavLink>
);
