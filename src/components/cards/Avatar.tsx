import React from 'react';
import styled from 'styled-components';

const Box = styled.div`
  display: flex;
  flex-direction: column;
  /* padding: 5px 10px; */
  background: #4f4f4f;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
  border-radius: 4px;
  align-self: center;
  width: 40px;
  height: 40px;
  font-size: 20px;
  line-height: 30px;
  margin: 12px 4px;
  /* identical to box height */
  letter-spacing: -0.333333px;
  /* Gray 6 */
  color: #f2f2f2;

  p {
    color: #f2f2f2;
    display: inline-block;
    flex: none;
    order: 0;
    align-self: center;
    margin-top: auto;
    margin-bottom: auto;
  }
`;

interface Props {
  firstname: string;
  lastname: string;
}

const Avatar = (props: Props) => {
  const firstLetter = props.firstname.charAt(0) || '';
  const lastLetter = props.lastname.charAt(0) || '';

  return (
    <Box>
      <p>
        {firstLetter}
        {lastLetter}
      </p>
    </Box>
  );
};

export default Avatar;
