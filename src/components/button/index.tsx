import React, { AnchorHTMLAttributes } from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
export * from './IconButton';
export * from './OldButton';

interface ButtonProps {
  color?: string;
  backgroundColor?: string;
}

const GenericButton = styled.button<ButtonProps>`
  height: 34px;
  padding: 10px 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => (props.color ? props.color : '#fa3d7f')};
  background: ${(props) =>
    props.backgroundColor ? props.backgroundColor : '#ffe8f0'};
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  :focus {
    outline: none;
  }
  svg {
    margin: 0px 4px;
    fill: ${(props) => (props.color ? props.color : '#fa3d7f')};
    path {
      fill: ${(props) => (props.color ? props.color : '#fa3d7f')};
    }
  }
`;

const GenericLinkButton = styled.a<ButtonProps>`
  height: 34px;
  padding: 10px 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => (props.color ? props.color : '#fa3d7f')};
  background: ${(props) =>
    props.backgroundColor ? props.backgroundColor : '#ffe8f0'};
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  text-decoration: none;
  border: none;
  svg {
    margin: 0px 4px;
    fill: ${(props) => (props.color ? props.color : '#fa3d7f')};
    path {
      fill: ${(props) => (props.color ? props.color : '#fa3d7f')};
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
  color?: string;
  backgroundColor?: string;
  image?: React.ReactNode;
}

type PropType = Props & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button: React.FC<PropType> = ({
  color,
  backgroundColor,
  image,
  ...props
}) => {
  return (
    <GenericButton {...props} color={color} backgroundColor={backgroundColor}>
      {image}
      {props.children}
    </GenericButton>
  );
};

interface LinkProps {
  color?: string;
  backgroundColor?: string;
  image?: React.ReactNode;
  local?: boolean;
}

type LinkPropType = LinkProps & React.AnchorHTMLAttributes<HTMLAnchorElement>;

const LocalLink = styled(NavLink)<ButtonProps>`
  padding: 10px 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => (props.color ? props.color : '#fa3d7f')};
  background: ${(props) =>
    props.backgroundColor ? props.backgroundColor : '#ffe8f0'};
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  text-decoration: none;
  border: none;

  svg {
    margin: 0px 4px;
    fill: ${(props) => (props.color ? props.color : '#fa3d7f')};
    path {
      fill: ${(props) => (props.color ? props.color : '#fa3d7f')};
    }
  }
`;

export const LinkButton: React.FC<LinkPropType> = ({ image, ...props }) => {
  if (props.local) {
    return (
      <LocalLink
        to={props.href || '/'}
        color={props.color}
        backgroundColor={props.backgroundColor}
      >
        {image}
        {props.children}
      </LocalLink>
    );
  }

  return (
    <GenericLinkButton
      {...props}
      color={props.color}
      backgroundColor={props.backgroundColor}
    >
      {image}
      {props.children}
    </GenericLinkButton>
  );
};

export default Button;
