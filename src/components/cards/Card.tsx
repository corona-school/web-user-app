import React, { useContext } from 'react';
import styled, { ThemeContext } from 'styled-components';

const OuterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background: #ffffff;
  box-shadow: 0 0 20px 20px rgba(0, 0, 0, 0.04);
  overflow: hidden;
`;

const Highlight = styled.div<{ highlightColor: string }>`
  height: 10px;
  background: ${(props) => props.highlightColor};
  margin-bottom: 5px;
`;

const Content = styled.div`
  display: flex;
  flex-direction: row;
  padding: 7px;
  width: 960px;
  height: 161px;
`;

const CardWrapper: React.FC<{
  highlightColor?: 'red' | 'yellow' | 'green' | 'blue';
  className?: string;
}> = ({
  children,
  className,
  highlightColor: highlightColorProp = 'green',
}) => {
  const theme = useContext(ThemeContext);

  const highlightColor = (() => {
    switch (highlightColorProp) {
      case 'red':
        return theme.color.cardHighlightRed;
      case 'yellow':
        return theme.color.cardHighlightYellow;
      case 'green':
        return theme.color.cardHighlightGreen;
      case 'blue':
        return theme.color.cardHighlightBlue;
      default:
        return theme.color.cardHighlightRed;
    }
  })();

  return (
    <OuterWrapper>
      <Highlight highlightColor={highlightColor} />
      <Content className={className}>{children}</Content>
    </OuterWrapper>
  );
};

export default CardWrapper;
