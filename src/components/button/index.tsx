import React, { AnchorHTMLAttributes } from 'react';
import styled from 'styled-components';
import classnames from 'classnames';
import { NavLink } from 'react-router-dom';
import classes from './index.module.scss';
export * from './IconButton';
export * from './OldButton';

const GenericLinkButton = styled.a<ButtonProps>`
  height: 34px;
  padding: 4px 10px;
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
  :hover {
    color: ${(props) => (props.color ? props.color : '#fa3d7f')};
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
    <button
      style={{ backgroundColor: backgroundColor, color: color }}
      className={classnames(classes.baseButton, props.className)}
    >
      {image}
      {props.children}
    </button>
  );
};

interface ButtonProps {
  color?: string;
  backgroundColor?: string;
}

interface LinkProps {
  color?: string;
  backgroundColor?: string;
  image?: React.ReactNode;
  local?: boolean;
}

type LinkPropType = LinkProps & React.AnchorHTMLAttributes<HTMLAnchorElement>;

const LocalLink = styled(NavLink)<ButtonProps>`
  padding: 4px 16px;
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
  :hover {
    color: ${(props) => (props.color ? props.color : '#fa3d7f')};
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
