import React, { AnchorHTMLAttributes } from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
export * from './IconButton';
export * from './OldButton';

const GenericButton = styled.button`
  height: 34px;
  padding: 10px 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fa3d7f;
  background: #ffe8f0;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  :focus {
    outline: none;
  }
  svg {
    margin: 0px 4px;
    fill: #fa3d7f;
    path {
      fill: #fa3d7f;
    }
  }
`;

const GenericLinkButton = styled.a`
  height: 34px;
  padding: 10px 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fa3d7f;
  background: #ffe8f0;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  text-decoration: none;
  border: none;
  svg {
    margin: 0px 4px;
    fill: #fa3d7f;
    path {
      fill: #fa3d7f;
    }
  }
  :active {
    border: none;
  }
  :focus {
    outline: none;
  }
`;

interface Props {
  image?: React.ReactNode;
}

type PropType = Props & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button: React.FC<PropType> = ({ image, ...props }) => {
  return (
    <GenericButton {...props}>
      {image}
      {props.children}
    </GenericButton>
  );
};

interface LinkProps {
  image?: React.ReactNode;
  local?: boolean;
}

type LinkPropType = LinkProps & React.AnchorHTMLAttributes<HTMLAnchorElement>;

const LocalLink = styled(NavLink)`
  padding: 10px 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fa3d7f;
  background: #ffe8f0;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  text-decoration: none;
  border: none;

  svg {
    fill: '#fa3d7f';
  }
`;

export const LinkButton: React.FC<LinkPropType> = ({ image, ...props }) => {
  if (props.local) {
    return (
      <LocalLink to={props.href || '/'}>
        {image}
        {props.children}
      </LocalLink>
    );
  }

  return (
    <GenericLinkButton {...props}>
      {image}
      {props.children}
    </GenericLinkButton>
  );
};

export default Button;
