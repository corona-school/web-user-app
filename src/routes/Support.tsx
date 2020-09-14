import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import Context from '../context';
import { ScreeningStatus } from '../types';
import MentorCard from '../components/cards/MentorCard';
import SupportCard from '../components/cards/SupportCard';
import { Text, Title } from '../components/Typography';
import { headerText, cardText1, cardText2 } from '../assets/supportTexts';

import classes from './Support.module.scss';
import { FileButton } from '../components/button/FileButton';
import { VideoCard } from '../components/cards/VideoCard';
import { ApiContext } from '../context/ApiContext';
import { Material } from '../types/Material';

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  margin: 0 !important;
`;

const MaterialCard1 = () => {
  const [files, setFiles] = useState<Material[]>([]);
  const [loading, setLoading] = useState(false);
  const apiContext = useContext(ApiContext);

  useEffect(() => {
    setLoading(true);
    apiContext
      .getMentoringMaterial('files', 'pdf_entry')
      .then((f) => setFiles(f))
      .then(() => console.log(files))
      .catch((err) =>
        console.warn(
          `Error when loading entry files for mentoring: ${err.message}`
        )
      )
      .finally(() => setLoading(false));
  }, [apiContext]);

  return (
    <div>
      <Title size="h4">
        <b>Materialien</b> für einen erfolgreichen Einstieg
      </Title>
      <Text>{cardText1}</Text>
      <div className={classes.links}>
        {files.map((f) => (
          <FileButton name={f.name} linkToFile={f.link} />
        ))}
      </div>
    </div>
  );
};

const MaterialCard2 = () => {
  const [files, setFiles] = useState<Material[]>([]);
  const [loading, setLoading] = useState(false);
  const apiContext = useContext(ApiContext);

  useEffect(() => {
    setLoading(true);
    apiContext
      .getMentoringMaterial('files', 'pdf_class')
      .then((f) => setFiles(f))
      .then(() => console.log(files))
      .catch((err) =>
        console.warn(
          `Error when loading class files for mentoring: ${err.message}`
        )
      )
      .finally(() => setLoading(false));
  }, [apiContext]);

  return (
    <div>
      <Title size="h4">
        <b>Materialien</b> zur Unterrichtsgestaltung
      </Title>
      <Text>{cardText2}</Text>
      <div className={classes.links}>
        {files.map((f) => (
          <FileButton name={f.name} linkToFile={f.link} />
        ))}
      </div>
    </div>
  );
};

const ToolsPlaylist = () => {
  const [videos, setVideos] = useState<Material[]>([]);
  const [loading, setLoading] = useState(false);
  const apiContext = useContext(ApiContext);

  useEffect(() => {
    setLoading(true);
    apiContext
      .getMentoringMaterial('playlist', 'playlist_tools')
      .then((v) => setVideos(v))
      .catch((err) =>
        console.warn(
          `Error when loading tools videos for mentoring: ${err.message}`
        )
      )
      .finally(() => setLoading(false));
  }, [apiContext]);

  return (
    <div className={classes.videoCards}>
      {videos.map((v) => (
        <VideoCard title={v.title} caption={v.description} id={v.id} />
      ))}
    </div>
  );
};

const InstructionsPlaylist = () => {
  const [videos, setVideos] = useState<Material[]>([]);
  const [loading, setLoading] = useState(false);
  const apiContext = useContext(ApiContext);

  useEffect(() => {
    setLoading(true);
    apiContext
      .getMentoringMaterial('playlist', 'playlist_instructions')
      .then((v) => setVideos(v))
      .catch((err) =>
        console.warn(
          `Error when loading instructions videos for mentoring: ${err.message}`
        )
      )
      .finally(() => setLoading(false));
  }, [apiContext]);

  return (
    <div className={classes.videoCards}>
      {videos.map((v) => (
        <VideoCard title={v.title} caption={v.description} id={v.id} />
      ))}
    </div>
  );
};

const Playlists = () => {
  return (
    <div className={classes.videos}>
      <Title>Hilfreiche Videos</Title>
      <Title size="h3">Tools für die Online-Nachhilfe</Title>
      <ToolsPlaylist />
      <Title size="h3">Erklärvideos</Title>
      <InstructionsPlaylist />
    </div>
  );
};

const Support: React.FC = () => {
  const modalContext = useContext(Context.Modal);
  const userContext = useContext(Context.User);

  useEffect(() => {
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
        <SupportCard>
          <MaterialCard1 />
        </SupportCard>
        <SupportCard>
          <MaterialCard2 />
        </SupportCard>
      </div>
      <Playlists />
    </div>
  );
};

export default Support;
