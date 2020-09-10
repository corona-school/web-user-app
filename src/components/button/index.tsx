import React from 'react';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import classes from './index.module.scss';

export * from './IconButton';
export * from './OldButton';

interface Props {
  color?: string;
  backgroundColor?: string;
  image?: React.ReactNode;
}

type PropType = Props & React.ButtonHTMLAttributes<HTMLButtonElement>;

interface WrapperProps {
  color?: string;
  backgroundColor?: string;
}

const StyleWrapper = styled.div<WrapperProps>`
  svg {
    path {
      fill: ${(props) => (props.color ? props.color : '#fa3d7f')};
    }
  }
`;

const Button: React.FC<PropType> = ({
  color,
  backgroundColor,
  image,
  ...props
}) => {
  return (
    <StyleWrapper color={color}>
      <button
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
        style={{ backgroundColor, color }}
        className={classnames(classes.baseButton, props.className, {
          [classes.disabled]: props.disabled,
        })}
      >
        {image}
        {props.children}
      </button>
    </StyleWrapper>
  );
};

interface LinkProps {
  color?: string;
  backgroundColor?: string;
  image?: React.ReactNode;
  local?: boolean;
}

type LinkPropType = LinkProps & React.AnchorHTMLAttributes<HTMLAnchorElement>;

export const LinkButton: React.FC<LinkPropType> = ({ image, ...props }) => {
  if (props.local) {
    return (
      <StyleWrapper color={props.color}>
        <Link
          to={props.href || '/'}
          style={{ color: props.color, backgroundColor: props.backgroundColor }}
          className={classnames(classes.baseButton, props.className)}
        >
          {image}
          {props.children}
        </Link>
      </StyleWrapper>
    );
  }

  return (
    <StyleWrapper color={props.color}>
      <a
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
        style={{ color: props.color, backgroundColor: props.backgroundColor }}
        className={classnames(classes.baseButton, props.className)}
      >
        {image}
        {props.children}
      </a>
    </StyleWrapper>
  );
};

export default Button;
