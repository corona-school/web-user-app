import React from 'react';
import styled from 'styled-components';
import Icons from '../../assets/icons';

export const IconButtonWrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  padding: 15px 7px;
`;

const IconButtonStyle = styled.button`
  align-items: center;
  background-color: ${(props) => props.theme.color.iconButton_backgroundColor};
  border-radius: 4px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
  color: ${(props) => props.theme.color.iconButton_color};
  cursor: pointer;
  display: flex;
  justify-content: center;
  font-size: 18px;
  height: 37px;
  line-height: 27px;
  letter-spacing: -0.333333px;
  margin: 0px 0px;
  padding: 5px;
  width: 179px;

  :active {
    background: ${(props) =>
      props.theme.color.iconButton_backgroundColor_active};
  }
`;

const IconStyle = styled.div`
  width: 24px;
  height: 24px;
  margin-right: 5px;
`;

type IconsKeys = keyof typeof Icons;
let myString: IconsKeys;

const IconButton: React.FC<
  {
    // icon?: keyof typeof Icons | React.ReactNode;
    icon: keyof typeof Icons;
    label: string;
  } & React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ icon, label, ...props }) => {
  const Icon = typeof icon === 'string' ? Icons[icon] : icon;

  return (
    <IconButtonStyle {...props}>
      <IconStyle>
        <Icon />
      </IconStyle>
      {label}
    </IconButtonStyle>
  );
};

export default IconButton;
