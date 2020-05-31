import React from 'react';
import styled from 'styled-components';

const OuterWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

const ChipWrapper = styled.div`
  width: 60px;
  height: 60px;

  /* Gray 2 */
  background: #4f4f4f;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
  border-radius: 4px;

  align-items: center;
  display: flex;
  justify-content: center;

  /* margin: 10px 0px; */
  margin: 7px 15px;
`;

const Text = styled.span`
  font-size: 24px;
  line-height: 36px;
  /* Gray 6 */
  color: #f2f2f2;
`;

const Chip: React.FC = ({ children }) => {
  return (
    <OuterWrapper>
      <ChipWrapper>
        <Text>{children}</Text>
      </ChipWrapper>
    </OuterWrapper>
  );
};

export default Chip;
