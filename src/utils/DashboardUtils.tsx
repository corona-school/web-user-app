import React from 'react';
import { User, ScreeningStatus } from '../types';
import Images from '../assets/images';
import AccentColorLinkButton from '../components/button/AccentColorLinkButton';

const StatusTexts = new Map([
  [
    'waitingForReply',
    {
      title: 'Wir warten auf eine Rückmeldung von dir!',
      description:
        'Aktuell sind wir nicht auf der Suche nach einem/einer Lernpartner:in für dich. Unter dem Menüpunkt Lernunterstützung kannst du jederzeit eine:n neue:n Lernpartner:in anfordern. Bei Schwierigkeiten kannst du dich an support@lern-fair.de wenden',
    },
  ],
  [
    'emailVerified',
    {
      title: 'Wir haben deine E-Mail-Adresse verifiziert! ',
      description:
        'Nun möchten wir dich gerne persönlich kennenlernen und dich zu einem digitalen Gespräch eingeladen. Unsere tagesaktuellen Verfügbarkeitszeiten findest du unter authentication.lern-fair.de. Dort wartet eine Person aus unserem Team auf dich!',
    },
  ],
  [
    'waitingForMatch',
    {
      title: 'Wir suchen nach einem/einer Lernpartner:in für dich!',
      description:
        'Sobald wir eine:n geeignete:n Lernpartner:in für dich gefunden haben, werden wir dich schnellstmöglich per E-Mail informieren. Solltest du innerhalb von 30 Tagen nichts von uns hören, überprüfe deinen Spam-Ordner und wende dich an support@lern-fair.de.',
    },
  ],
  [
    'foundMatch',
    {
      title: 'Wir haben eine:n Lernpartner:in für dich gefunden!',
      description:
        'Das gemeinsame Lernen kann nun endlich starten. Alle Informationen zu deinem/deiner neuen Lernpartner:in findest du im Menüpunkt Lernunterstützung. Bei Fragen und Schwierigkeiten kannst du dich jederzeit an support@lern-fair.de wenden.',
    },
  ],
  [
    'accountDeactivated',
    {
      title: ' Wir haben deinen Account deaktiviert! ',
      description:
        'Schade, dass du Lern-Fair verlassen hast. Wir haben deine aktuellen Lernunterstützung aufgelöst und deine Lernpartner:innen darüber informiert. Falls du zu einem späteren Zeitpunkt wieder Teil vo0n Lern-Fair werden möchtest, kannst du dich bei uns melden.',
    },
  ],
]);

const hasNoRequests = (user: User) =>
  !user.matchesRequested || user.matchesRequested === 0;

const hasRequests = (user: User) =>
  user.matchesRequested && user.matchesRequested > 0;

export const getStatus = (user: User) => {
  if (!user.active) {
    return StatusTexts.get('accountDeactivated');
  }

  if (
    user.type === 'student' &&
    user.screeningStatus === ScreeningStatus.Unscreened
  ) {
    return StatusTexts.get('emailVerified');
  }

  if (user.matches.length === 0 && hasNoRequests(user)) {
    return StatusTexts.get('waitingForReply');
  }
  if (user.matches.length > 0 && hasNoRequests(user)) {
    return StatusTexts.get('foundMatch');
  }
  if (user.matches.length === 0 && hasRequests(user)) {
    return StatusTexts.get('waitingForMatch');
  }
  if (user.matches.length > 0 && hasRequests(user)) {
    return StatusTexts.get('waitingForMatch');
  }

  return null;
};

interface Step {
  title: string;
  image: React.ReactNode;
  texts: string[];
  action: React.ReactNode;
}

const CheckInformationStep: Step = {
  title: 'Informationen überprüfen',
  image: <Images.StepsCheckInformation width="160px" height="160px" />,
  texts: [
    'Damit wir dich mit einem/einer passende:n Lernpartner:in verbinden können, überprüfe bitte deine persönlichen Informationen.',
    'Achte darauf, dass deine Fächer korrekt im System hinterlegt sind. ',
    'Sollte es dir nicht möglich sein ein bestimmtes Feld zu ändern, melde dich bei support@lern-fair.de.',
  ],
  action: (
    <AccentColorLinkButton
      link="/settings"
      local
      accentColor="#F4486D"
      label="Überprüfen"
      small
    />
  ),
};

const MeetUsStep: Step = {
  title: 'Unser Team kennenlernen',
  image: <Images.StepsMeetUs width="160px" height="160px" />,
  texts: [
    'Wir möchten dich gerne persönlich kennenlernen und zu einem digitalen Gespräch einladen, in welchem du auch deine Frage loswerden kannst.',
    'Du benötigst etwa 10 Minuten, einen Computer mit Kamera und einen Studierendenausweis.',
    'Für einen reibungslosen Ablauf benutze bitte Google Chrome.',
  ],
  action: (
    <AccentColorLinkButton
      link="https://authentication.lern-fair.de/"
      accentColor="#F4486D"
      label="Kennenlernen"
      small
    />
  ),
};

const MatchedStep: Step = {
  title: 'Zuordnung erhalten',
  image: <Images.StepsMatched width="160px" height="160px" />,
  texts: [
    'Sobald wir eine:n geeignete:n Lernpartner:in für dich gefunden haben, werden wir dich schnellst- möglich per E-Mail informieren.',
    'Bitte überprüfe dafür auch regelmäßig deinen Spam-Ordner.',
    'Solltest du innerhalb von 30 Tagen nichts von uns hören, melde dich bitte bei support@lern-fair.de.',
  ],
  action: (
    <AccentColorLinkButton
      link="/matches"
      local
      accentColor="#F4486D"
      label="Abwarten"
      small
    />
  ),
};

const ContactMatchStep: Step = {
  title: 'Lernpartner:in kontaktieren',
  image: <Images.StepsContact width="160px" height="160px" />,
  texts: [
    'Überlege dir zunächst, wie viel Zeit du in das gemeinsame Lernen investieren möchtest und zu welchen Uhrzeiten du verfügbar bist.',
    'Kontaktiere anschließend deine:n Lernpartner:in und schlag ihm/ihr einen Termin per E-Mail vor.',
    ' Gerne könnt ihr genaue Inhalte schon vor dem ersten Gespräch abstimmen.',
  ],
  action: (
    <AccentColorLinkButton
      link="/matches"
      local
      accentColor="#F4486D"
      label="Kontaktieren"
      small
    />
  ),
};

const PrepareLessonStep: Step = {
  title: 'Gespräch vorbereiten',
  image: <Images.StepsReadMore width="160px" height="160px" />,
  texts: [
    'Zur Vorbereitung auf dein erstes Kennenlern-gespräch haben wir verschiedene Leitfäden entwickelt, an welchen du dich orientieren kannst.',
    'Bitte lies unsere Dokumente sorgfältig durch und mache dich mit unseren ethischen Standards vertraut.',
    'Profitiere von unseren Empfehlungen für gute, digitale Lernunterstützung.',
  ],
  action: (
    <AccentColorLinkButton
      link="/support"
      accentColor="#F4486D"
      label="Vorbereiten"
      small
    />
  ),
};

const LessonStep: Step = {
  title: 'Gemeinsam lernen',
  image: <Images.StepsLearnTogether width="160px" height="160px" />,
  texts: [
    'In einem ersten digitalen Gespräch könnt ihr euch besser kennenlernen und das gemeinsame Lernen starten.',
    'Dazu könnt ihr direkt im Browser oder mit dem Handy zur vereinbarten Uhrzeit in einen gemeinsamen Video-Chat eintreten.',
    'Bei Schwierigkeiten kannst du dich an support@lern-fair.de wenden.',
  ],
  action: (
    <AccentColorLinkButton
      link="/matches"
      local
      accentColor="#F4486D"
      label="Lernen"
      small
    />
  ),
};

const FeedbackStep: Step = {
  title: 'Feedback geben',
  image: <Images.StepsFeedback width="160px" height="160px" />,
  texts: [
    'Wir würden uns sehr freuen, wenn du unseren Fragebogen ausfüllst, damit wir unsere Plattform für euch weiter verbessern können.',
    'Der Fragebogen ist anonymisiert und dauert nicht länger als 5 Minuten.',
    'Falls du differenziertes Feedback an uns richten möchtest, schreibe eine Mail an feedback@lern-fair.de',
  ],
  action: (
    <AccentColorLinkButton
      link="/"
      local
      accentColor="#F4486D"
      label="Feedback"
      small
    />
  ),
};

const RequestMatchStep: Step = {
  title: 'Mehr Schüler:innen helfen',
  image: <Images.StepsRequest width="160px" height="160px" />,
  texts: [
    'Durch die Schulschließungen benötigen immer mehr Schüler:innen Unterstützung beim Lernen.',
    'Wir würden uns wahnsinnig freuen, wenn du weiteren Schüler:innen unter die Arme greifen möchtest.',
    'Ganz nach deinen zeitlichen Kapazitäten kannst du jederzeit mehr oder auch weniger helfen.',
  ],
  action: (
    <AccentColorLinkButton
      link="/matches"
      local
      accentColor="#F4486D"
      label="Anfordern"
      small
    />
  ),
};

const NextSteps = new Map([
  ['studentHasNoMatch', [CheckInformationStep, MeetUsStep, MatchedStep]],
  ['pupilHasNoMatch', [CheckInformationStep, MatchedStep]],
  ['hasMatch', [ContactMatchStep, PrepareLessonStep, LessonStep]],
  ['studentHasOldMatch', [FeedbackStep, RequestMatchStep]],
  ['pupilHasOldMatch', [FeedbackStep]],
]);

export const getNextSteps = (user: User) => {
  if (user.matches.length === 0 && user.type === 'student') {
    return NextSteps.get('studentHasNoMatch');
  }
  if (user.matches.length === 0 && user.type === 'pupil') {
    return NextSteps.get('pupilHasNoMatch');
  }
  if (user.matches.length > 0) {
    return NextSteps.get('hasMatch');
  }
  return null;
};

const StudentNews = [
  {
    headline: 'Campus Representative',
    text:
      'Du möchtest Lern-Fair an deiner Universität/Hochschule vertreten? Schreibe eine Mail an campusrep@lern-fair.de.',
  },
  {
    headline: 'Mentoring Programm',
    text: (
      <span>
        Du möchtest dich mit anderen Studierenden oder unseren Mentor:innen
        austauschen?{' '}
        <a href="https://www.facebook.com/groups/coronaschoolgermany/">
          https://www.facebook.com/groups/coronaschoolgermany/
        </a>
      </span>
    ),
  },
];

const PupilNews = [
  {
    headline: 'Sommer AGs',
    text:
      'Der Sommerurlaub fällt aus? Wir bieten spannende digitale und kostenfreie AGs in den Sommerferien an.',
    withLink: false,
  },
  {
    headline: 'Repetitorien',
    text:
      'Dir wurden wichtige Unterrichtsinhalte während der Corona-Krise nicht erklärt? Unsere Repetitorien sind deine Rettung!',
  },
];

export const getNews = (user: User) => {
  if (user.type === 'pupil') {
    return PupilNews;
  }
  return StudentNews;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export function hexToRGB(hex, a) {
  let r: any = 0;
  let g: any = 0;
  let b: any = 0;

  // 3 digits
  if (hex.length === 4) {
    r = `0x${hex[1]}${hex[1]}`;
    g = `0x${hex[2]}${hex[2]}`;
    b = `0x${hex[3]}${hex[3]}`;

    // 6 digits
  } else if (hex.length === 7) {
    r = `0x${hex[1]}${hex[2]}`;
    g = `0x${hex[3]}${hex[4]}`;
    b = `0x${hex[5]}${hex[6]}`;
  }

  return `rgb(${+r},${+g},${+b},${a})`;
}

/**
 * Source: https://stackoverflow.com/a/14919494
 * CC BY-SA 4.0
 *
 * Format bytes as human-readable text.
 *
 * @param bytes Number of bytes.
 * @param si True to use metric (SI) units, aka powers of 1000. False to use
 *           binary (IEC), aka powers of 1024.
 * @param dp Number of decimal places to display.
 *
 * @return Formatted string.
 */
export function friendlyFileSize(bytes, si = false, dp = 1) {
  let size = bytes;
  const thresh = si ? 1000 : 1024;

  if (Math.abs(size) < thresh) {
    return `${size} B`;
  }

  const units = si
    ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  let u = -1;
  const r = 10 ** dp;

  do {
    size /= thresh;
    u += 1;
  } while (
    Math.round(Math.abs(size) * r) / r >= thresh &&
    u < units.length - 1
  );

  return `${size.toFixed(dp)} ${units[u]}`;
}
