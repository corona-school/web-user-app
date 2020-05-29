import React from 'react';
import styled from 'styled-components';
export * from './IconButton';
export * from './OldButton';

const GenericButton = styled.button`
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

export default Button;
