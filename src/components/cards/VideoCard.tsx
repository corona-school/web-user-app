import React, { useContext } from 'react';
import styled, { ThemeContext } from 'styled-components';
import classes from './VideoCard.module.scss';
import { Title } from '../Typography';

const Highlight = styled.div`
  background-color: ${(props) => props.color};
  height: 8px;
`;

export const VideoCard = ({ url, title, caption }) => {
  const theme = useContext(ThemeContext);

  return (
    <div className={classes.container}>
      <Highlight color={theme.color.cardHighlightBlue} />
      <div className={classes.cardContent}>
        {title && <Title size="h4">{title}</Title>}
        <iframe
          className={classes.video}
          title={url}
          src={url}
          frameBorder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        {caption && <div className={classes.caption}>{caption}</div>}
      </div>
    </div>
  );
};
