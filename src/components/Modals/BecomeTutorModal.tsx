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

    if (subjects.length === 0) {
      message.error(
        'Bitte wähle die Fächer aus, in denen du unterstützen möchtest.'
      );
      setLoading(false);
      return;
    }

    if (supportsInDaz && languages.length === 0) {
      message.error(
        'Bitte wähle die Sprachen aus, in denen du unterstützen kannst.'
      );
      setLoading(false);
      return;
    }

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

  const handleOnChangeDazSupport = (value: string) => {
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
  };

  if (loading) {
    return (
      <StyledReactModal isOpen={modalContext.openedModal === 'becomeTutor'}>
        <div className={classes.modal}>
          <div className={classes.title}>
            <Title size="h2">Tutor:in werden</Title>
          </div>
          <div className={classes.clipLoader}>
            <ClipLoader size={100} color="#123abc" loading />
          </div>
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
        <div className={classes.title}>
          <Title size="h2">Tutor:in werden</Title>
        </div>
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
          style={{ margin: '8px' }}
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
            <div style={{ margin: '8px' }}>
              <Select
                mode="multiple"
                value={languages}
                onChange={(value) => setLanguages(value)}
                placeholder="Bitte wähle deine Sprachen aus"
                style={{ width: '100%' }}
              >
                {Languages.map((l) => (
                  <Option value={l}>{l}</Option>
                ))}
              </Select>
            </div>
          </>
        )}
        <div className={classes.buttonContainer}>
          <AccentColorButton
            label="Anmelden"
            onClick={onFinish}
            accentColor="#e78b00"
          />
        </div>
      </div>
    </StyledReactModal>
  );
};

export default BecomeTutorModal;
