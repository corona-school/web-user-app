import React, { useContext } from 'react';
import styled, { ThemeContext } from 'styled-components';
import classes from './VideoCard.module.scss';
import { Title, Text } from '../Typography';

const Highlight = styled.div`
  background-color: ${(props) => props.color};
  height: 8px;
`;

export const VideoCard = ({ title, caption, id }) => {
  const theme = useContext(ThemeContext);

  const url = `https://www.youtube-nocookie.com/embed/${id}`;

  return (
    <div className={classes.container}>
      <Highlight color={theme.color.cardHighlightBlue} />
      <div className={classes.cardContent}>
        {title && (
          <Title className={classes.title} size="h5" bold>
            {title}
          </Title>
        )}
        <iframe
          className={classes.video}
          title={url}
          src={url}
          frameBorder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        {caption && <Text className={classes.caption}>{caption}</Text>}
      </div>
    </div>
  );
};
