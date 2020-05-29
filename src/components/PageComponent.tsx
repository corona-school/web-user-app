import React, { useState } from 'react';
import styled from 'styled-components';
import Navigation from './Navigation';
import Header from './Header';

const PageWrapper = styled.div`
  display: flex;
  overflow-x: hidden;
`;
interface MenuProps {
  readonly isMenuOpen: boolean;
}

const MenuBackground = styled.div<MenuProps>`
  position: fixed;
  width: 100vw;
  height: 100vh;
  z-index: 299;
  overflow: auto;
  top: 0px;
  left: 0;
  pointer-events: ${(props) => (props.isMenuOpen ? 'auto' : 'none')};
  background-color: #0000008a;
  opacity: ${(props) => (props.isMenuOpen ? 1 : 0)};
  transition: opacity 0.3s ease-in-out;
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
    align-items: center;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    z-index: 1;
    padding-bottom: 40px;

    ::after {
      content: 'spacer';
      visibility: hidden;
    }
  }
`;

const PageComponent: React.FC<{ hasNavigation?: boolean }> = ({
  children,
  hasNavigation = true,
}) => {
  const [isMenuOpen, setMenuOpen] = useState(false);

  return (
    <PageWrapper>
      {hasNavigation && (
        <Navigation isMenuOpen={isMenuOpen} setMenuOpen={setMenuOpen} />
      )}
      <MenuBackground
        isMenuOpen={isMenuOpen}
        onClick={() => setMenuOpen(false)}
      />

      <ContentWrapper>
        <Header setMenuOpen={setMenuOpen} />
        <div className="content">{children}</div>
      </ContentWrapper>
    </PageWrapper>
  );
};

export default PageComponent;
