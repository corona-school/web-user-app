import React, { useContext } from 'react';
import styled, { ThemeContext } from 'styled-components';

const OuterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  /* padding: 0px; */

  /* position: relative; */
  /* width: 960px; */
  /* height: 176px; */

  background: #ffffff;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
  border-radius: 4px;
  overflow: hidden;
`;

const Highlight = styled.div<{ highlightColor: string }>`
  /* width: 961px; */
  height: 10px;

  /* position: relative; */
  /* left: -0.5px; */

  background: ${(props) => props.highlightColor};
  margin-bottom: 5px;
`;

const Content = styled.div`
  /* INNER WRAPPER:
  position: static;
  left: 0px;
  top: 15px;
  Inside Auto Layout
  flex: none;
  order: 1;
  align-self: center;
  margin: 0px 0px; */

  display: flex;
  flex-direction: row;
  padding: 7px;

  /* position: absolute; */
  width: 960px;
  height: 161px;
  /* left: 0px; */
  /* top: 0px; */
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
