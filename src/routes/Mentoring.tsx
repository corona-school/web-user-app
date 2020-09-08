import React, { useContext } from 'react';
import classes from './Mentoring.module.scss';
import { Title, Text } from '../components/Typography';
import { mentoringText } from '../assets/mentoringText';
import { ContactCard } from '../components/cards/ContactCard';
import { UserContext } from '../context/UserContext';

const Categories = [
  {
    label: 'Sprachschwierigkeiten und Kommunikation',
    value: 'sprachliches@mentoring.corona-school.de',
  },
  {
    label: 'Inhaltliche Kompetenzen in bestimmten Unterrichtsfächern',
    value: 'inhaltliches@mentoring.corona-school.de',
  },
  {
    label: 'Pädagogische und didaktische Hilfestellungen',
    value: 'paedagogisches@mentoring.corona-school.de',
  },
  {
    label: 'Technische Unterstützung',
    value: 'technisches@mentoring.corona-school.de',
  },
  {
    label: 'Organisatorisches und Selbststrukturierung',
    value: 'selbststrukturierung@mentoring.corona-school.de',
  },
  { label: 'Sonstiges', value: 'mentoring@corona-school.de' },
];

const Mentoring = () => {
  const userContext = useContext(UserContext);

  if (userContext.user.type !== 'student') return <></>;

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <Title>Mentoring</Title>
        <Text>{mentoringText}</Text>
      </div>
      <ContactCard categories={Categories} />
    </div>
  );
};

export default Mentoring;
