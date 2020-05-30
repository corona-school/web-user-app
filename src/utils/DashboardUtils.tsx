import React from 'react';
import { User, ScreeningStatus } from '../types';
import Images from '../assets/images';
import Button from '../components/button';

const StatusTexts = new Map([
  [
    'waitingForReply',
    {
      title: 'Wir warten auf eine Rückmeldung von dir!',
      description:
        'Aktuell sind wir nicht auf der Suche nach einem/einer Lernpartner*in für dich. Unter dem Menüpunkt Zuordnung kannst du jederzeit eine*n neue*n Lernpartner*in anfordern. Bei Schwierigkeiten kannst du dich an support@corona-school.de wenden',
    },
  ],
  [
    'emailVerified',
    {
      title: 'Wir haben deine E-Mail-Adresse verifiziert! ',
      description:
        'Nun möchten wir dich gerne persönlich kennenlernen und dich zu einem digitalen Gespräch eingeladen. Unsere tagesaktuellen Verfügbarkeitszeiten findest du unter authentication.corona-school.de. Dort wartet eine Person aus unserem Team auf dich!',
    },
  ],
  [
    'waitingForMatch',
    {
      title: 'Wir suchen nach einem/einer Lernpartner*in für dich!',
      description:
        'Sobald wir eine*n geeignete*n Lernpartner*in für dich gefunden haben, werden wir dich schnellstmöglich per E-Mail informieren. Solltest du innerhalb einer Woche nichts von uns hören, überprüfe deinen Spam-Ordner und wende dich an support@corona-school.de.',
    },
  ],
  [
    'foundMatch',
    {
      title: 'Wir haben eine*n Lernpartner*in für dich gefunden!',
      description:
        'Das gemeinsame Lernen kann nun endlich starten. Alle Informationen zu deinem/deiner neuen Lernpartner*in findest du im Menüpunkt Zuordnung. Bei Fragen und Schwierigkeiten kannst du dich jederzeit an support@corona-school.de wenden.',
    },
  ],
  [
    'accountDeactivated',
    {
      title: ' Wir haben deinen Account deaktiviert! ',
      description:
        'Schade, dass du die Corona School verlassen hast. Wir haben deine aktuellen Zuordnungen aufgelöst und deine Lernpartner*innen darüber informiert. Falls du zu einem späteren Zeitpunkt wieder Teil der Corona School werden möchtest, kannst du dich bei uns melden.',
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
};

interface Step {
  title: string;
  image: React.ReactNode;
  texts: string[];
  action: React.ReactNode;
}

const CheckInformationStep: Step = {
  title: 'Informationen überprüfen',
  image: <Images.StepsCheckInformation />,
  texts: [
    'Damit wir dich mit einem/einer passende*n Lernpartner*in verbinden können, überprüfe bitte deine persönlichen Informationen.',
    'Achte darauf, dass deine Fächer korrekt im System hinterlegt sind. ',
    'Sollte es dir nicht möglich sein ein bestimmtes Feld zu ändern, melde dich bei support@corona-school.de.',
  ],
  action: <Button>Überprüfen</Button>,
};

const MeetUsStep: Step = {
  title: 'Unser Team kennenlernen',
  image: <Images.StepsMeetUs />,
  texts: [
    'Wir möchten dich gerne persönlich kennenlernen und zu einem digitalen Gespräch einladen, in welchem du auch deine Frage loswerden kannst.',
    'Du benötigst etwa 10 Minuten, einen Computer mit Kamera und einen Studierendenausweis.',
    'Für einen reibungslosen Ablauf benutze bitte Google Chrome.',
  ],
  action: <Button>Kennenlernen</Button>,
};

const MatchedStep: Step = {
  title: 'Zuordnung erhalten',
  image: <Images.StepsMatched />,
  texts: [
    'Sobald wir eine*n geeignete*n Lernpartner*in für dich gefunden haben, werden wir dich schnellst- möglich per E-Mail informieren.',
    'Bitte überprüfe dafür auch regelmäßig deinen Spam-Ordner.',
    'Solltest du innerhalb einer Woche nichts von uns hören, melde dich bitte bei support@corona-school.de.',
  ],
  action: <Button>Abwarten</Button>,
};

const ContactMatchStep: Step = {
  title: 'Lernpartner*in kontaktieren',
  image: <div>No Image yet</div>,
  texts: [
    'Überlege dir zunächst, wie viel Zeit du in das gemeinsame Lernen investieren möchtest und zu welchen Uhrzeiten du verfügbar bist.',
    'Kontaktiere anschließend deine*n Lernpartner*in und schlag ihm/ihr einen Termin per E-Mail vor.',
    ' Gerne könnt ihr genaue Inhalte schon vor dem ersten Gespräch abstimmen.',
  ],
  action: <Button>Kontaktieren</Button>,
};

const PrepareLessonStep: Step = {
  title: 'Gespräch vorbereiten',
  image: <div>No Image yet</div>,
  texts: [
    'Zur Vorbereitung auf dein erstes Kennenlerngespräch haben wir verschiedene Leitfäden entwickelt, an welchen du dich orientieren kannst.',
    'Bitte lese unsere Dokumente sorgfältig durch und mache dich mit unseren ethischen Standards vertraut.',
    'Profitiere von unseren Empfehlungen für gute, digitale Lernunterstützung.',
  ],
  action: <Button>Vorbereiten</Button>,
};

const LessonStep: Step = {
  title: 'Gemeinsamen lernen',
  image: <div>No Image yet</div>,
  texts: [
    'In einem ersten digitalen Gespräch könnt ihr euch besser kennenlernen und das gemeinsame Lernen starten.',
    'Ganz unkompliziert könnt ihr direkt im Browser oder mit dem Handy zur vereinbarten Uhrzeit in einen gemeinsamen Video-Chat eintreten.',
    'Bei Schwierigkeiten kannst du dich an support@corona-school.de wenden.',
  ],
  action: <Button>Lernen</Button>,
};

const FeedbackStep: Step = {
  title: 'Feedback geben',
  image: <div>No Image yet</div>,
  texts: [
    'Wir würden uns sehr freuen, wenn du unseren Fragebogen ausfüllst, damit wir unsere Plattform für euch weiter verbessern können.',
    'Der Fragebogen ist anonymisiert und dauert nicht länger als 5 Minuten.',
    'Falls du differenziertes Feedback an uns richten möchtest, schreibe eine Mail an feedback@corona-school.de',
  ],
  action: <Button>Feedback</Button>,
};

const RequestMatchStep: Step = {
  title: 'Mehr Schüler*innen helfen',
  image: <div>No Image yet</div>,
  texts: [
    'Durch die Schulschließungen benötigen immer mehr Schüler*innen Unterstützung beim Lernen.',
    'Wir würden uns wahnsinnig freuen, wenn du weiteren Schüler*innen unter die Arme greifen möchtest.',
    'Ganz nach deinen zeitlichen Kapazitäten kannst du jederzeit mehr oder auch weniger helfen.',
  ],
  action: <Button>Anfordern</Button>,
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
};
