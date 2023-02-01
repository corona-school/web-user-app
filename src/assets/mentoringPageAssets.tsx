import React from 'react';
import { MentoringCategory } from '../types/Mentoring';

export const headerText =
  'Online-Nachhilfe ist möglicherweise auch für dich eine neue Erfahrung, ' +
  'welche viele Fragen und Schwierigkeiten aufwirft. Damit bist du nicht ' +
  'allein! Wir haben ein Mentoring-Programm entwickelt, um dich optimal zu ' +
  'unterstützen. Mentor:innen von Lern-Fair zeichnen sich durch ihre ' +
  'Berufserfahrung und Expertise in verschiedenen Bereichen aus. Hier kannst ' +
  'du deine Fragen loswerden und wertvolle Tipps für gute, digitale ' +
  'Zusammenarbeit erhalten. Darüber hinaus kannst du dich mit anderen ' +
  'Helfer:innen bei Peer-to-Peer Calls oder in der Facebook-Gruppe austauschen.';

export const facebookCardText =
  'Du möchtest dich mit anderen Helfer:innen über Unterrichtsmethoden ' +
  'austauschen, hast organisatorische Fragen zur Plattform oder benötigst ' +
  'anderweitig Hilfe? Dann tritt unserer Facebook-Gruppe bei.';

export const feedbackCallText =
  'Du hast Lust, dich mit anderen Helfer:innen über deine Erfahrungen und ' +
  'Herausforderungen bei der Online-Nachhilfe auszutauschen? Dann bist du ' +
  'herzlich zu unseren gemeinsamen Peer-to-Peer Calls eingeladen. Der passende ' +
  'Link wird immer am Tag des Calls veröffentlicht.';

export const moreInformationButtonLink =
  'https://drive.google.com/file/d/1UvrOSlS3nF_Bk-0hGlnBwzf0xWBm3cKQ/view';

export const facebookLink =
  'https://www.facebook.com/groups/coronaschoolgermany';

export const messageLabels = new Map([
  [MentoringCategory.DIDACTIC, 'Pädagogische und didaktische Hilfestellungen'],
  [MentoringCategory.LANGUAGE, 'Sprachschwierigkeiten und Kommunikation'],
  [MentoringCategory.OTHER, 'Sonstiges'],
  [MentoringCategory.SELFORGA, 'Organisatorisches und Selbststrukturierung'],
  [
    MentoringCategory.SUBJECTS,
    'Inhaltliche Kompetenzen in bestimmten Unterrichtsfächern',
  ],
  [MentoringCategory.TECH, 'Technische Unterstützung'],
]);

export const AgreementText = (
  <>
    Ich habe die{' '}
    <a href="https://www.lern-fair.de/datenschutz">Datenschutzerklärung</a> zur
    zur Kenntnis genommen. Ich stimme einer elektronischen Speicherung und
    Verarbeitung meiner eingegebenen Daten zur Beantwortung meiner Anfrage zu.
  </>
);
