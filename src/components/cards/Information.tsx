import React from 'react';
import styled from 'styled-components';

const StyledInformation = styled.div`
  /* userInfo */

  /* Auto Layout */
  display: flex;
  flex-direction: column;
  padding: 7px 0px;

  position: relative;
  width: 320px;
  height: 145px;

  /* justify-content: space-around; */

  > strong {
    font-weight: bold;
    font-size: 16px;
    line-height: 24px;

    /* Gray 2 */
    color: #4f4f4f;

    margin: 0px 7px;
  }

  > em {
    font-style: italic;
    font-size: 14px;
    line-height: 21px;

    /* Gray 3 */
    color: #828282;

    margin: 0px 7px;
  }
`;

const Title = styled.span`
  font-size: 24px;
  line-height: 36px;

  /* Gray 1 */
  color: #333333;

  margin: 0px 7px;
`;

const Subtitle = styled.span`
  font-style: italic;
  font-size: 14px;
  line-height: 21px;

  /* Gray 3 */
  color: #828282;

  margin: 0px 7px;

  flex-grow: 1;
`;

const Information: React.FC<{ title?: string; subtitle?: string }> = ({
  title,
  subtitle,
  children,
}) => {
  return (
    <StyledInformation>
      {title && <Title>{title}</Title>}
      {subtitle && <Subtitle>{subtitle}</Subtitle>}
      {children}
    </StyledInformation>
  );
};

export default Information;
