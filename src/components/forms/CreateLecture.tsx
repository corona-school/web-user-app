/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useContext } from 'react';
import { Form, InputNumber, List, DatePicker, TimePicker, message } from 'antd';
import moment from 'moment';
import Button from '../button';
import Context from '../../context';
import { Lecture } from '../../types/Course';
import { CompletedCourse, CompletedLecture } from '../../routes/CourseForm';

import classes from './CreateLecture.module.scss';
import { CompletedSubCourse } from './CreateCourse';

interface Props {
  lectures: CompletedLecture[];
  subCourse: CompletedSubCourse;
  course: CompletedCourse;
  next: () => void;
  onSuccess: (lecture: CompletedLecture) => void;
  onCancelLecture: (id: number) => void;
  edit: boolean;
}

export const CreateLecture: React.FC<Props> = (props) => {
  const [start, setStart] = useState<moment.Moment>(moment().add(2, 'days'));
  const [duration, setDuration] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();
  const apiContext = useContext(Context.Api);

  const renderFormItems = () => {
    return (
      <div className={classes.forms}>
        <Form.Item
          className={classes.formItem}
          name="class"
          rules={[
            () => ({
              validator() {
                if (start && duration) {
                  return Promise.resolve();
                }
                return Promise.reject('Bitte fülle alle Felder korrekt aus.');
              },
            }),
          ]}
        >
          Der Kurs ist am
          <DatePicker
            disabledDate={(date) => {
              return props.edit
                ? moment(date).isBefore(moment(), 'day')
                : moment(new Date())
                    .startOf('day')
                    .add(2, 'days')
                    .diff(date.clone().startOf('day'), 'days') >= 1;
            }}
            value={start}
            onChange={(v) => setStart(v)}
            style={{ margin: '0px 4px' }}
            placeholder="25.06.2020"
            format="DD.MM.YYYY"
          />{' '}
          um
          <TimePicker
            minuteStep={5}
            onChange={(v) => setStart(v)}
            value={start}
            style={{ margin: '0px 4px' }}
            defaultOpenValue={moment('00:00:00', 'HH:mm')}
            format="HH:mm"
          />
          und dauert
          <InputNumber
            value={duration}
            step={5}
            min={15}
            onChange={(v: number) => setDuration(v)}
            style={{ margin: '0px 4px', width: '64px' }}
            placeholder="45"
          />
          Minuten
        </Form.Item>
      </div>
    );
  };

  const handleCourseCreation = async () => {
    try {
      setLoading(true);
      await form.validateFields();
    } catch (err) {
      setLoading(false);
      console.log(err);
      return;
    }
    try {
      const lecture: Lecture = {
        instructor: '',
        start: start.unix(),
        duration,
      };

      const lectureId = await apiContext.createLecture(
        props.course.id,
        props.subCourse.id,
        lecture
      );

      setLoading(false);
      props.onSuccess({
        ...lecture,
        id: lectureId,
        subCourseId: props.subCourse.id,
      });
    } catch (err) {
      setLoading(false);
      message.error('Ein Fehler ist aufgetreten. Bitte versuche es erneut.');
      console.log(err);
    }
  };

  const deleteLecture = (id: number, subCourseId: number) => {
    setLoading(true);
    apiContext
      .cancelLecture(props.course.id, subCourseId, id)
      .then(() => {
        props.onCancelLecture(id);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const renderSubCourses = () => {
    return (
      <List
        className={classes.listContainer}
        itemLayout="horizontal"
        header="Erstelle hier deine Lektionen"
        dataSource={
          props.lectures ? props.lectures.sort((a, b) => a.start - b.start) : []
        }
        loading={loading}
        bordered
        footer={
          <div className={classes.footerContainer}>
            <div className="ant-list-footer" style={{ marginBottom: 0 }}>
              Lektion hinzufügen
            </div>
            <div style={{ padding: '0px 0px 8px 24px', marginTop: '-8px' }}>
              <div className="ant-form-item-explain">
                {!props.edit
                  ? 'Der Termin muss mindestens 2 Tage in der Zukunft liegen.'
                  : 'Bitte benachrichtige später die Teilnehmer*innen des Kurses über Änderungen eines Kursdatums mithilfe der "Nachricht senden" Funktion in den Einstellungen dieses Kurses.'}
              </div>
            </div>
            <div className={classes.footerForm}>
              {renderFormItems()}
              <Button
                onClick={handleCourseCreation}
                className={classes.button}
                color="white"
                backgroundColor="#4E6AE6"
              >
                Erstellen
              </Button>
            </div>
          </div>
        }
        renderItem={(item) => (
          <List.Item
            actions={
              moment.unix(item.start).isAfter(moment()) // prevent deletion of lectures from the past
                ? [
                    <a
                      key="list-loadmore-more"
                      onClick={() => deleteLecture(item.id, item.subCourseId)}
                    >
                      löschen
                    </a>,
                  ]
                : []
            }
          >
            <List.Item.Meta
              title={props.course.name}
              description={`Der Kurs ist am ${moment
                .unix(item.start)
                .format('DD.MM.YYYY')} um ${moment
                .unix(item.start)
                .format('HH:mm')} Uhr und dauert ${item.duration} min.`}
            />
          </List.Item>
        )}
      />
    );
  };

  return (
    <Form
      form={form}
      className={classes.formContainer}
      layout="vertical"
      name="basic"
      initialValues={{ remember: true }}
    >
      {renderSubCourses()}

      <Button
        onClick={props.next}
        className={classes.button}
        color="#4E6AE6"
        backgroundColor="white"
      >
        Fertigstellen
      </Button>
    </Form>
  );
};
