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
  selectedParticipants: CourseParticipant[];
  setSelectedParticipants: (selectedParticipants: CourseParticipant[]) => void;
  isSelecting: boolean;
  setSelecting: (isSelecting: boolean) => void;
  canContact: boolean;
}

export default function CourseParticipants(props: Props) {
  const modalContext = useContext(ModalContext);
  const [action, setAction] = useState<'certificate' | 'contact'>(null);

  if (!props.course.subcourse) {
    return null;
  }

  if (props.course.subcourse.participants === 0) {
    return <Empty description="Du hast noch keine Teilnehmer*innen" />;
  }

  const resetSelect = () => {
    props.setSelectedParticipants([]);
    props.setSelecting(false);
  };

  const getHint = () => {
    switch (action) {
      case 'certificate':
        return 'Bitte wähle die Teilnehmenden aus, für die du die Zertifikate ausstellen willst.';
      case 'contact':
        return 'Bitte wähle die Teilnehmenden aus, die du kontaktieren willst.';
      default:
        return '';
    }
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
          {!props.isSelecting && (
            <AccentColorButton
              accentColor="#1890FF"
              disabled={!props.hasEnded}
              label="Teilnahmezertifikate ausstellen"
              disabledHint="Du kannst erst Teilnahmezertifikate ausstellen, wenn der Kurs vorüber ist."
              small
              onClick={() => {
                props.setSelecting(true);
                setAction('certificate');
              }}
            />
          )}
          {!props.isSelecting && (
            <div style={{ marginLeft: 10 }}>
              <AccentColorButton
                accentColor="#1890FF"
                label="Teilnehmende kontaktieren"
                small
                onClick={() => {
                  props.setSelecting(true);
                  setAction('contact');
                }}
                disabledHint="Du kannst keine Teilnehmer:innen mehr kontaktieren, nachdem 14 Tage seit Kursende vergangen sind."
                disabled={!props.canContact}
              />
            </div>
          )}

          {props.isSelecting && (
            <AccentColorButton
              accentColor="#055202"
              disabled={
                props.selectedParticipants.length === 0 && props.isSelecting
              }
              disabledHint="Wähle mindestens eine:n Teilnehmer:in aus."
              label="Weiter"
              small
              onClick={() => {
                if (action === 'certificate') {
                  modalContext.setOpenedModal('issueCertificateModal');
                } else if (action === 'contact') {
                  modalContext.setOpenedModal('contactCourseModal');
                }
              }}
            />
          )}
          {props.isSelecting && (
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
          {props.isSelecting && (
            <div>
              <AccentColorButton
                accentColor="#505050"
                noBg
                label={
                  props.participantList.length ===
                  props.selectedParticipants.length
                    ? 'Keine auswählen'
                    : 'Alle auswählen'
                }
                small
                onClick={() => {
                  if (
                    props.participantList.length ===
                    props.selectedParticipants.length
                  ) {
                    props.setSelectedParticipants([]);
                  } else {
                    props.setSelectedParticipants(props.participantList);
                  }
                }}
              />
            </div>
          )}
          {props.isSelecting && (
            <span style={{ marginLeft: 20 }}>
              {props.selectedParticipants.length === 0
                ? getHint()
                : `${props.selectedParticipants.length} Teilnehmende ausgewählt`}
            </span>
          )}
        </div>
        <IssueCertificateModal
          course={props.course}
          selectedParticipants={props.selectedParticipants}
          resetSelect={resetSelect}
        />
      </div>
      <List
        className={classes.participantList}
        dataSource={props.participantList}
        renderItem={(item) => (
          <List.Item
            actions={[
              <div>{SchoolTypesMap[item.schooltype]}</div>,
              <span>{item.grade}. Klasse</span>,
            ]}
          >
            {props.isSelecting && (
              <input
                type="checkbox"
                style={{ marginRight: 20 }}
                checked={props.selectedParticipants.some(
                  (p) => p.uuid === item.uuid
                )}
                onChange={(e) => {
                  if (e.target.checked) {
                    props.setSelectedParticipants([
                      ...props.selectedParticipants,
                      item,
                    ]);
                  } else {
                    props.setSelectedParticipants([
                      ...props.selectedParticipants.filter(
                        (p) => p.uuid !== item.uuid
                      ),
                    ]);
                  }
                }}
              />
            )}
            <List.Item.Meta title={`${item.firstname} ${item.lastname}`} />
          </List.Item>
        )}
      />
    </div>
  );
}
