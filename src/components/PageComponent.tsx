import React from 'react';
import styled from 'styled-components';
import Navigation from './Navigation';

const PageWrapper = styled.div`
  display: flex;

  overflow-x: hidden;
  background-color: ${(props) => props.theme.color.pageBackground};
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-height: 100vh;
  position: relative;

  .content {
    max-height: 100vh;
    overflow-y: scroll;
    box-sizing: border-box;
    align-items: center;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    padding-top: 20px;
    z-index: 1;

    ::after {
      content: 'spacer';
      visibility: hidden;
    }
  }

  .content > * {
    margin-bottom: 20px;
  }
`;

const PageComponent: React.FC<{ hasNavigation?: boolean }> = ({
  children,
  hasNavigation = true,
}) => {
  return (
    <PageWrapper>
      {hasNavigation && <Navigation />}
      <ContentWrapper>
        <div className="content">{children}</div>
      </ContentWrapper>
    </PageWrapper>
  );
};

export default PageComponent;
