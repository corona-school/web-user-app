import React, { useContext, useState } from 'react';
import StyledReactModal from 'styled-react-modal';
import { message, Radio, Select } from 'antd';
import ClipLoader from 'react-spinners/ClipLoader';
import { Subject, User } from '../../types';
import { ModalContext } from '../../context/ModalContext';
import { languageOptions as Languages } from '../../assets/languages';
import classes from './BecomeTutorModal.module.scss';
import { Text, Title } from '../Typography';
import SelectSubjectList from '../forms/SelectSubjectList';
import { ApiContext } from '../../context/ApiContext';
import { UserContext } from '../../context/UserContext';
import { dev } from '../../api/config';
import AccentColorButton from '../button/AccentColorButton';

const { Option } = Select;

interface Props {
  user: User;
}

const BecomeTutorModal: React.FC<Props> = () => {
  const modalContext = useContext(ModalContext);
  const userContext = useContext(UserContext);
  const api = useContext(ApiContext);

  const [loading, setLoading] = useState<boolean>(false);

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [supportsInDaz, setSupportsInDaz] = useState<boolean>(false);
  const [languages, setLanguages] = useState<typeof Languages[number][]>([]);

  const onFinish = () => {
    setLoading(true);

    api
      .postUserRoleTutor({ subjects, supportsInDaz, languages })
      .then(() => {
        message.success('Du wurdest erfolgreich als Tutor:in registriert.');
        modalContext.setOpenedModal(null);
        userContext.fetchUserData();
      })
      .catch((err) => {
        if (dev) console.error(err);
        message.error('Etwas ist schief gegangen.');
      })
      .finally(() => setLoading(false));
  };

  function handleOnChangeDazSupport(value: string) {
    setSupportsInDaz(value === 'yes');
    if (subjects.find((s) => s.name === 'Deutsch als Zweitsprache')) {
      return;
    }
    if (value === 'yes') {
      setSubjects([
        ...subjects,
        { name: 'Deutsch als Zweitsprache', minGrade: 1, maxGrade: 13 },
      ]);
    }
  }

  if (loading) {
    return (
      <StyledReactModal isOpen={modalContext.openedModal === 'becomeTutor'}>
        <div className={classes.modal}>
          <Title size="h2">Tutor:in werden</Title>
          <ClipLoader size={100} color="#123abc" loading />
          <div className={classes.buttonContainer}>
            <AccentColorButton
              label="Anmelden"
              onClick={() => {}}
              accentColor="#e78b00"
            />
          </div>
        </div>
      </StyledReactModal>
    );
  }

  return (
    <StyledReactModal
      isOpen={modalContext.openedModal === 'becomeTutor'}
      onBackgroundClick={() => modalContext.setOpenedModal(null)}
    >
      <div className={classes.modal}>
        <Title size="h2">Tutor:in werden</Title>
        <Text large>
          In welchen Fächern kannst du Schüler:innen unterstützen?
        </Text>
        <SelectSubjectList subjects={subjects} onChange={setSubjects} />
        <Text large>
          Kannst du dir vorstellen Schüler:innen zu unterstützen, die noch über
          wenige Deutschkenntnisse verfügen?
        </Text>
        <Radio.Group
          onChange={(e) => handleOnChangeDazSupport(e.target.value)}
          value={supportsInDaz ? 'yes' : 'no'}
        >
          <Radio.Button value="yes">Ja</Radio.Button>
          <Radio.Button value="no">Nein</Radio.Button>
        </Radio.Group>
        {supportsInDaz && (
          <>
            <Text large>
              Auf welchen Sprachen kannst du Schüler:innen prinzipiell
              unterstützen?
            </Text>
            <Select
              mode="multiple"
              value={languages}
              onChange={(value) => setLanguages(value)}
              placeholder="Bitte wähle deine Sprachen aus"
              style={{ width: '300px' }}
            >
              {Languages.map((l) => (
                <Option value={l}>{l}</Option>
              ))}
            </Select>
          </>
        )}
      </div>
      <div className={classes.buttonContainer}>
        <AccentColorButton
          label="Anmelden"
          onClick={onFinish}
          accentColor="#e78b00"
        />
      </div>
    </StyledReactModal>
  );
};

export default BecomeTutorModal;
