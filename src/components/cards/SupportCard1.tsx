import React, {Component} from 'react';
//import {Document, Page } from "react-pdf";
import CardBase from '../base/CardBase';
import { Text, Title } from '../Typography';
import styled from 'styled-components';
//import Button from '../button';
//import { CourseOverview } from '../../types/Course';

import classes from './SupportCard1.module.scss';
import { User } from '../../types';

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  margin: 0 !important;
`;

interface Props {
    user: User;
  }

const SupportCard1: React.FC<Props> = ({ user }) => {
  return (
    <CardBase highlightColor="#79CFCD" className={classes.baseContainer}>
        <Wrapper>
        <Title size="h4"> <b>Materialien</b> für einen erfolgreichen Einstieg</Title>
        </Wrapper>
        <Text>
            Um dich optimal auf dein erstes Kennenlerngespräch mit deinem/deiner Lernpartner*in vorzubereiten, haben wir mehrere Hilfestellungen
            für dich entwickelt. Unser Leitfaden zum Kennenlerngespräch bietet dir einen ersten Anhaltspunkt, welche Themen ihr gemeinsam besprechen
            könnt. Bei technischen Problemen mit den Video-Chat könnt ihr jederzeit auf unser Troubleshoot-Dokument zurückgreifen.
        </Text>
       
    </CardBase>
  );
};

export default SupportCard1;
