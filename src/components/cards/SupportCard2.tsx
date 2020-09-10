import React from 'react';
import CardBase from '../base/CardBase';
import { Text, Title } from '../Typography';
import styled from 'styled-components';
import Button from '../button';
//import { CourseOverview } from '../../types/Course';

import classes from './SupportCard2.module.scss';
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

const SupportCard2: React.FC<Props> = ({ user }) => {
  return (
    <CardBase highlightColor="#79CFCD" className={classes.baseContainer}>
        <Wrapper>
        <Title size="h4"> <b>Materialien</b> zur Unterrichtsgestaltung</Title>
        </Wrapper>
        <Text>
            Damit du deine Unterstützung möglichst fortschrittlich und digital anbieten kannst, haben wir weitere Hilfestellungen für dich
            entwickelt. Hier findest du sowohl Tipps zu verschiedenen Online-Tools als auch pädagogische Tricks für eine langfristig
            erfolgreiche Zusammenarbeit. Falls du auf der Suche nach weiterem Lehr- und Lernmaterial bist, haben wir mehrere Empfehlungen
            für dich gesammelt.
        </Text>
       
    </CardBase>
  );
};

export default SupportCard2;
