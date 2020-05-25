import React, { ReactChildren, ReactElement } from 'react';
import styled from 'styled-components';
import Navigation from './Navigation';
import { ReactComponent as LogoSVG } from '../assets/icons/logo.svg';
import { ReactComponent as Vektor1 } from '../assets/icons/Vector1.svg';
import { ReactComponent as Vektor2 } from '../assets/icons/Vector2.svg';

const PageWrapper = styled.div`
  background-color: ${(props) => props.theme.color.pageBackground};
  display: flex;
  height: 100vh;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;

  position: relative;

  .content {
    align-items: center;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    overflow-y: auto;
    padding-top: 90px;
    z-index: 1;

    ::after {
      content: 'spacer';
      visibility: hidden;
    }
  }

  .content > * {
    margin-bottom: 60px;
  }

  .footer {
    color: ${(props) => props.theme.color.legalText};
    display: flex;
    justify-content: center;
    padding: 1em;
    z-index: 1;

    a {
      color: inherit;
      text-decoration: none;

      :hover {
        text-decoration: underline;
      }
    }
  }

  > .vector1 {
    position: absolute;
    width: 830px;
    height: 570px;
    left: 0;
    top: 0;
  }

  > .vector2 {
    position: absolute;
    width: 588px;
    height: 525px;
    right: 0;
    top: 0;
  }
`;

const Logo = styled.a`
  align-items: center;
  color: ${(props) => props.theme.color.logo};
  display: flex;
  font-size: 36px;
  font-style: normal;
  font-weight: normal;
  line-height: 54px;
  position: absolute;
  right: 48px;
  text-decoration: none;
  top: 18px;
  user-select: none;
  cursor: pointer;

  svg {
    height: 1em;
    width: 1em;
    margin-right: 0.3em;
    fill: ${(props) => props.theme.color.logo};
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
        <Vektor1 className="vector1" />
        <Vektor2 className="vector2" />
        <div className="content">
          {children}
          <Logo href="https://www.corona-school.de/">
            <LogoSVG />
          </Logo>
        </div>
        <div className="footer">
          <span>
            ©2020 Corona School e.V.
            {' - '}
            <a target="_blank" href="https://www.corona-school.de/impressum">Impressum</a>
            {' - '}
            <a target="_blank" href="https://www.corona-school.de/datenschutz">
              Datenschutzerklärung
            </a>
          </span>
        </div>
      </ContentWrapper>
    </PageWrapper>
  );
};

export default PageComponent;
