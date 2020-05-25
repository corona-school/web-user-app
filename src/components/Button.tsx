import React, { ReactElement } from 'react';
import styled from 'styled-components';

const Container = styled.button`
  padding: 0;
  border: none;
  background: white;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #fafbfd;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.15);
  border-radius: 4px;

  width: 200px;
  align-self: center;
  height: 37px;
  margin-bottom: 13px;

  text-align: left;
  font-size: 18px;
  line-height: 27px;
  letter-spacing: -0.333333px;
  transition: all 0.1s ease-in-out;

  color: #333333;

  cursor: pointer;
  text-decoration: none;

  :active {
    background: #dadada;
  }
  :focus {
    outline: 0;
  }
  :hover {
    transform: scale(1.05);
  }

  svg {
    margin: 0px 8px;
  }
`;

const Text = styled.p`
  display: inline-block;
  align-self: flex-start;
  margin-top: auto;
  margin-bottom: auto;
  margin-left: 7px;
`;

interface ILinkButtonProps {
  href: string;
  icon?: ReactElement;
  text: string;
  className?: string;
  target?: string;
}

export const LinkButton: React.FC<ILinkButtonProps> = ({
  href,
  icon,
  text,
  className,
  target,
}) => {
  return (
    <Container as="a" className={className} href={href} target={target}>
      {icon}
      <Text>{text}</Text>
    </Container>
  );
};

interface IButtonProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  icon?: ReactElement;
  text: string;
  className?: string;
}

const Button: React.FC<IButtonProps> = ({ onClick, icon, text, className }) => {
  return (
    <Container className={className} onClick={onClick}>
      {icon}
      <Text>{text}</Text>
    </Container>
  );
};

export default Button;

const ButtonDestructiveStyle = styled.button`
  /* display: flex; */
  /* flex-direction: row; */
  padding: 10px 41px;

  background: #fafbfd;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 4px;

  font-size: 18px;
  line-height: 27px;

  color: ${(props) => props.theme.color.destructiveButton};

  cursor: pointer;

  :active {
    background: #dadada;
  }
`;

export const ButtonDestructive: React.FC<{ onClick: () => void }> = ({
  children,
  onClick,
}) => {
  return (
    <ButtonDestructiveStyle onClick={onClick}>
      {children}
    </ButtonDestructiveStyle>
  );
};

export const ButtonNonDestructive = styled(ButtonDestructiveStyle)`
  color: ${(props) => props.theme.color.gray2};
`;
