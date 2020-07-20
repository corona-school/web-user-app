import React, { useState } from 'react';
import styled from 'styled-components';
import Navigation from './Navigation';
import Header from './Header';

const PageWrapper = styled.div`
  display: flex;
  width: 100vw;
`;
interface MenuProps {
  readonly isMenuOpen: boolean;
}

const MenuBackground = styled.div<MenuProps>`
  position: fixed;
  width: 100vw;
  height: 100%;
  z-index: 999;
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
  position: relative;
  flex-shrink: 1;
  flex-grow: 1;
  min-width: 0;

  .content {
    height: 100%;
    align-items: center;
    overflow-x: hidden;

    display: flex;
    flex-direction: column;

    z-index: 1;

    ::after {
      flex: 0 0 60px;
      visibility: hidden;
      content: 'spacer';
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
