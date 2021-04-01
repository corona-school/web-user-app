import React, { useContext, useState } from 'react';
import StyledReactModal from 'styled-react-modal';
import { Radio, Select } from 'antd';
import { Subject, User } from '../../types';
import { ModalContext } from '../../context/ModalContext';
import { languageOptions as Languages } from '../../assets/languages';
import classes from './BecomeTutorModal.module.scss';
import { Text, Title } from '../Typography';
import SelectSubjectList from '../forms/SelectSubjectList';

const { Option } = Select;

interface Props {
  user: User;
}

const BecomeTutorModal: React.FC<Props> = () => {
  const modalContex = useContext(ModalContext);

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [dazSupport, setDazSupport] = useState<boolean>(false);
  const [languages, setLanguages] = useState<typeof Languages[number][]>([]);

  function handleOnChangeDazSupport(value: string) {
    setDazSupport(value === 'yes');
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

  return (
    <StyledReactModal
      isOpen={modalContex.openedModal === 'becomeTutor'}
      onBackgroundClick={() => modalContex.setOpenedModal(null)}
    >
      <div className={classes.modal}>
        <Title size="h2">Tutor*in werden</Title>
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
          value={dazSupport ? 'yes' : 'no'}
        >
          <Radio.Button value="yes">Ja</Radio.Button>
          <Radio.Button value="no">Nein</Radio.Button>
        </Radio.Group>
        {dazSupport && (
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
    </StyledReactModal>
  );
};

export default BecomeTutorModal;
