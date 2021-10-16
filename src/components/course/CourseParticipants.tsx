import React, { useContext, useState } from 'react';
import { Col, Empty, List, Row } from 'antd';
import SearchParticipant from './SearchParticipant';
import SortParticipant from './SortParticipant';
import AccentColorButton from '../button/AccentColorButton';
import IssueCertificateModal from '../Modals/IssueCertificateModal';
import classes from '../../routes/CourseDetail.module.scss';
import { ModalContext } from '../../context/ModalContext';
import { CourseParticipant, ParsedCourseOverview } from '../../types/Course';
import { SchoolTypesMap } from '../../assets/schoolTypes';

interface Props {
  course: ParsedCourseOverview;
  participantList: CourseParticipant[];
  setEnteredFilter: (filter: string) => void;
  setParticipantList: (participantList: CourseParticipant[]) => void;
  hasEnded: boolean;
}

export default function CourseParticipants(props: Props) {
  const modalContext = useContext(ModalContext);

  const [isSelecting, setSelecting] = useState(false);
  const [selectedParticipants, setSelectedParticipants] = useState<
    CourseParticipant[]
  >([]);

  if (!props.course.subcourse) {
    return null;
  }

  if (props.course.subcourse.participants === 0) {
    return <Empty description="Du hast noch keine Teilnehmer:innen" />;
  }

  const resetSelect = () => {
    setSelectedParticipants([]);
    setSelecting(false);
  };

  return (
    <div>
      <div>
        <Row gutter={16}>
          <Col
            xxl={{ span: 12, offset: 12 }}
            md={{ span: 18, offset: 6 }}
            sm={24}
            xs={24}
          >
            <SearchParticipant
              inputValue={(value) => props.setEnteredFilter(value)}
            />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <SortParticipant
              setParticipantList={(value) => props.setParticipantList(value)}
              getParticipantList={props.participantList}
            />
          </Col>
        </Row>
        <br />
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <AccentColorButton
            accentColor={!isSelecting ? '#1890FF' : '#055202'}
            disabled={
              (selectedParticipants.length === 0 && isSelecting) ||
              !props.hasEnded
            }
            disabledHint={
              !props.hasEnded
                ? 'Du kannst erst Teilnehmerzertifikate ausstellen, wenn der Kurs vorüber ist.'
                : 'Wähle mindestens eine:n Schüler:in aus.'
            }
            label={!isSelecting ? 'Teilnahmezertifikate ausstellen' : 'Weiter'}
            small
            onClick={() => {
              if (!isSelecting) {
                setSelecting(true);
              } else {
                modalContext.setOpenedModal('issueCertificateModal');
              }
            }}
          />
          {isSelecting && (
            <div style={{ marginLeft: 10 }}>
              <AccentColorButton
                accentColor="#842c2c"
                noBg
                label="Abbrechen"
                small
                onClick={resetSelect}
              />
            </div>
          )}
          {isSelecting && (
            <span style={{ marginLeft: 20 }}>
              {selectedParticipants.length === 0
                ? 'Bitte wähle die Schüler aus, für die du die Zertifikate ausstellen willst.'
                : `${selectedParticipants.length} Schüler ausgewählt`}
            </span>
          )}
        </div>
        <IssueCertificateModal
          course={props.course}
          selectedParticipants={selectedParticipants}
          resetSelect={resetSelect}
        />
      </div>
      <List
        className={classes.participantList}
        // itemLayout="horizontal"
        dataSource={props.participantList}
        renderItem={(item) => (
          <List.Item
            actions={[
              <div>{SchoolTypesMap[item.schooltype]}</div>,
              <span>{item.grade} Klasse</span>,
            ]}
          >
            {isSelecting && (
              <input
                type="checkbox"
                style={{ marginRight: 20 }}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedParticipants([...selectedParticipants, item]);
                  } else {
                    setSelectedParticipants([
                      ...selectedParticipants.filter(
                        (p) => p.uuid !== item.uuid
                      ),
                    ]);
                  }
                }}
              />
            )}
            <List.Item.Meta
              title={`${item.firstname} ${item.lastname}`}
              description={<a href={`mailto:${item.email}`}>{item.email}</a>}
            />
          </List.Item>
        )}
      />
    </div>
  );
}
