import React, { ReactNode, useContext, useEffect, useState } from 'react';
import { Spin } from 'antd';
import { useHistory } from 'react-router-dom';
import Context from '../context';
import { ScreeningStatus } from '../types';
import SupportCard from '../components/cards/SupportCard';
import { Text, Title } from '../components/Typography';
import { headerText, cardText1, cardText2 } from '../assets/supportPageAssests';

import classes from './Support.module.scss';
import { FileButton } from '../components/button/FileButton';
import { VideoCard } from '../components/cards/VideoCard';
import { ApiContext } from '../context/ApiContext';
import { Material } from '../types/Material';
import AccountNotScreenedModal from '../components/Modals/AccountNotScreenedModal';

const MaterialCard = ({
  location,
  title,
  description,
}: {
  location: string;
  title: ReactNode;
  description: string;
}) => {
  const [files, setFiles] = useState<Material[]>([]);
  const [loading, setLoading] = useState(false);
  const apiContext = useContext(ApiContext);

  useEffect(() => {
    setLoading(true);
    apiContext
      .getMentoringMaterial('files', location)
      .then((f) => setFiles(f))
      .then(() => console.log(files))
      .catch((err) =>
        console.warn(
          `Error when loading ${location} for mentoring: ${err.message}`
        )
      )
      .finally(() => setLoading(false));
  }, [apiContext]);

  return (
    <SupportCard>
      <Title size="h4">{title}</Title>
      <Text>{description}</Text>
      {loading && (
        <div className={classes.spin}>
          <Spin />
        </div>
      )}
      {!loading && (
        <div className={classes.links}>
          {files.map((f) => (
            <FileButton name={f.name} linkToFile={f.link} />
          ))}
        </div>
      )}
    </SupportCard>
  );
};

const Playlist = ({ location }: { location: string }) => {
  const [videos, setVideos] = useState<Material[]>([]);
  const [loading, setLoading] = useState(false);
  const apiContext = useContext(ApiContext);

  useEffect(() => {
    setLoading(true);
    apiContext
      .getMentoringMaterial('playlist', location)
      .then((v) => setVideos(v))
      .catch((err) =>
        console.warn(
          `Error when loading playlist ${location} for mentoring: ${err.message}`
        )
      )
      .finally(() => setLoading(false));
  }, [apiContext]);

  return (
    <div>
      {loading && (
        <div className={classes.spin}>
          <Spin />
        </div>
      )}
      {!loading && (
        <div className={classes.videoCards}>
          {videos.map((v) => (
            <VideoCard title={v.title} caption={v.description} id={v.id} />
          ))}
        </div>
      )}
    </div>
  );
};

const Support: React.FC = () => {
  const modalContext = useContext(Context.Modal);
  const userContext = useContext(Context.User);
  const history = useHistory();

  useEffect(() => {
    if (userContext.user.type !== 'student') {
      history.push('/');
    }
    if (
      userContext.user.screeningStatus === ScreeningStatus.Unscreened ||
      (userContext.user.isInstructor &&
        userContext.user.instructorScreeningStatus ===
          ScreeningStatus.Unscreened)
    ) {
      modalContext.setOpenedModal('accountNotScreened');
    }
  }, [userContext.user.screeningStatus]);

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <Title>Hilfestellungen</Title>
        <Text large>{headerText}</Text>
      </div>
      <div className={classes.materials}>
        <MaterialCard
          location="pdf_entry"
          title={
            <div>
              <b>Materialien</b> für einen erfolgreichen Einstieg
            </div>
          }
          description={cardText1}
        />
        <MaterialCard
          location="pdf_class"
          title={
            <div>
              <b>Materialien</b> zur Unterrichtsgestaltung
            </div>
          }
          description={cardText2}
        />
      </div>
      <div className={classes.videos}>
        <Title className={classes.headlines}>Hilfreiche Videos</Title>
        <Title size="h3" className={classes.headlines}>
          Tools für die Online-Nachhilfe
        </Title>
        <Playlist location="playlist_tools" />
        <Title size="h3" className={classes.headlines}>
          Erklärvideos
        </Title>
        <Playlist location="playlist_instructions" />
      </div>
      <AccountNotScreenedModal />
    </div>
  );
};

export default Support;
