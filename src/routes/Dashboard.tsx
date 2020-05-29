import React from 'react';
import PageComponent from '../components/PageComponent';
import { Title, Text } from '../components/Typography';
import classes from './Dashboard.module.scss';
import { Tag } from '../components/Tag';
import Icons from '../assets/icons';
import { ColumnCard } from '../components/Card';
import Images from '../assets/images';
import Button from '../components/button';

const Dashboard: React.FC = () => {
  return (
    <PageComponent>
      <div className={classes.topGrid}>
        <div className={classes.statusContainer}>
          <Title size="h1">Dein aktueller Status</Title>
          <Title size="h4">Wir haben deine E-Mail-Adresse verifiziert!</Title>
          <div className={classes.content}>
            <Text large className={classes.text}>
              Nun möchten wir dich gerne persönlich kennenlernen und dich zu
              einem digitalen Gespräch eingeladen. Unsere tagesaktuellen
              Verfügbarkeitszeiten findest du unter{' '}
              <a
                href="https://authentication.corona-school.de/"
                target="_blank"
                rel="noopener noreferrer"
              >
                authentication.corona-school.de
              </a>
              . Dort wartet eine Person aus unserem Team auf dich!
            </Text>
          </div>
        </div>
        <div className={classes.newsContainer}>
          <div className={classes.bookIcon}>
            <Icons.NotebookBlue />
          </div>
          <Title size="h3" bold>
            Neuigkeiten
          </Title>
          <div className={classes.newsContentContainer}>
            <div className={classes.newsContent}>
              <div className={classes.newsHeadline}>
                <Tag>NEU</Tag>
                <Title bold size="h5">
                  Campus Representative
                </Title>
              </div>
              <Text>
                Du möchtest die Corona School an deiner Universität/Hochschule
                vertreten? Schreibe eine Mail an campus@corona-school.de
              </Text>
            </div>
            <div className={classes.newsContent}>
              <div className={classes.newsHeadline}>
                <Tag>NEU</Tag>
                <Title bold size="h5">
                  Mentoring Programm
                </Title>
              </div>
              <Text>
                Du möchtest dich mit anderen Studierenden oder unseren
                Mentor*innen austauschen? facebook.com/groups/coronaschoolge
              </Text>
            </div>
          </div>
        </div>
      </div>
      <div className={classes.bottomContainer}>
        <Title size="h3">Deine nächsten Schritte</Title>
        <div className={classes.bottomGrid}>
          <ColumnCard
            title="Informationen Überprüfen"
            image={<Images.StepsCheckInformation />}
            button={<Button>Überprüfen</Button>}
          >
            <Text>
              Damit wir dich mit einem/einer passende*n Lernpartner*in verbinden
              können, überprüfe bitte deine persönlichen Informationen.
            </Text>
            <Text>
              Achte darauf, dass deine Fächer korrekt im System hinterlegt sind.
            </Text>
            <Text>
              Sollte es dir nicht möglich sein ein bestimmtes Feld zu ändern,
              melde dich bei support@corona-school.de.
            </Text>
          </ColumnCard>
          <ColumnCard
            title="Unser Team kennenlernen"
            image={<Images.StepsCheckInformation />}
            button={<Button>Kennenlernen</Button>}
          >
            <Text>
              Wir möchten dich gerne persönlich kennenlernen und zu einem
              digitalen Gespräch einladen, in welchem du auch deine Frage
              loswerden kannst.
            </Text>
            <Text>
              Du benötigst etwa 10 Minuten, einen Computer mit Kamera und einen
              Studierendenausweis.
            </Text>
            <Text>
              Für einen reibungslosen Ablauf benutze bitte Google Chrome.
            </Text>
          </ColumnCard>
          <ColumnCard
            title="Zuordnung erhalten"
            image={<Images.StepsCheckInformation />}
            button={<Button>Abwarten</Button>}
          >
            <Text>
              Sobald wir eine*n geeignete*n Lernpartner*in für dich gefunden
              haben, werden wir dich schnellst- möglich per E-Mail informieren.
            </Text>
            <Text>
              Bitte überprüfe dafür auch regelmäßig deinen Spam-Ordner.
            </Text>
            <Text>
              Solltest du innerhalb einer Woche nichts von uns hören, melde dich
              bitte bei support@corona-school.de.
            </Text>
          </ColumnCard>
        </div>
      </div>
    </PageComponent>
  );
};

export default Dashboard;
