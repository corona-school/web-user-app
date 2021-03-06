import React from 'react';
import styled from 'styled-components';
import { Title } from './Typography';
import classes from './Card.module.scss';

const Hightlight = styled.div`
  min-height: 11px;
  max-height: 11px;
  width: 100%;
  background: #f4486d;
`;

interface Props {
  title: string;
  image: React.ReactNode;
  children?: React.ReactNode;
  button?: React.ReactNode;
  color?: 'red' | 'yellow' | 'green';
}

export const ColumnCard: React.FC<Props> = (props) => {
  return (
    <div className={classes.container}>
      <Hightlight color={props.color} />
      <div className={classes.content}>
        <Title size="h4">{props.title}</Title>
        <div className={classes.image}>{props.image}</div>
        <div className={classes.children}>{props.children}</div>
        {props.button && <div className={classes.button}>{props.button}</div>}
      </div>
    </div>
  );
};
