/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useContext } from 'react';
import Button from '../button';
import {
  Form,
  InputNumber,
  List,
  Select,
  DatePicker,
  TimePicker,
  message,
} from 'antd';
import Context from '../../context';
import { CompletedSubCourse } from './CreateSubCourse';
import { Lecture } from '../../types/Course';
import { CompletedCourse, CompletedLecture } from '../../routes/CourseForm';
import moment from 'moment';

import classes from './CreateLecture.module.scss';

const { Option } = Select;

interface Props {
  lectures: CompletedLecture[];
  subCourses: CompletedSubCourse[];
  course: CompletedCourse;
  next: () => void;
  onSuccess: (lecture: CompletedLecture) => void;
  onCancelLecture: (id: number) => void;
}

export const CreateLecture: React.FC<Props> = (props) => {
  const [start, setStart] = useState<moment.Moment>(moment());
  const [duration, setDuration] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);
  const [selectedSubCourseId, setSelectedSubCourseId] = useState(null);
  const [form] = Form.useForm();
  const apiContext = useContext(Context.Api);

  const renderFormItems = () => {
    return (
      <div className={classes.forms}>
        <Form.Item
          className={classes.formItem}
          name="class"
          rules={[
            (_) => ({
              validator() {
                if (start && duration) {
                  return Promise.resolve();
                }
                return Promise.reject('Du musst die Klassen begrenzen.');
              },
            }),
          ]}
        >
          Der Kurs ist am
          <DatePicker
            value={start}
            onChange={(v) => setStart(v)}
            style={{ margin: '0px 4px' }}
            placeholder="25.06.2020"
            format={'DD.MM.YYYY'}
          />{' '}
          um
          <TimePicker
            minuteStep={5}
            onChange={(v) => setStart(v)}
            value={start}
            style={{ margin: '0px 4px' }}
            defaultOpenValue={moment('00:00:00', 'HH:mm')}
            format={'HH:mm'}
          />
          und dauert
          <InputNumber
            value={duration}
            step={5}
            min={0}
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

      const lecture: Lecture = {
        instructor: '',
        start: start.unix(),
        duration,
      };
      console.log(lecture);
      apiContext
        .createLecture(props.course.id, selectedSubCourseId, lecture)
        .then((id) => {
          setLoading(false);
          props.onSuccess({ ...lecture, id, subCourseId: selectedSubCourseId });
        })
        .catch((err) => {
          setLoading(false);
          message.error(
            'Ein Fehler ist aufgetreten. Bitte versuche es erneut.'
          );
          console.log(err);
        });
    } catch (err) {
      setLoading(false);
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
        dataSource={props.lectures}
        loading={loading}
        bordered
        footer={
          <div className={classes.footerContainer}>
            <div className="ant-list-footer">Lektion hinzufügen</div>
            <div className={classes.footerForm}>
              <div className={classes.selectContainer}>
                <Select
                  className={classes.courseSelect}
                  onChange={(v) => {
                    setSelectedSubCourseId(v);
                  }}
                  placeholder="Wähle einen Kurs aus"
                >
                  {props.subCourses.map((subCourse) => {
                    return (
                      <Option
                        value={subCourse.id}
                      >{`${props.course.name} ${subCourse.minGrade}-${subCourse.maxGrade}`}</Option>
                    );
                  })}
                </Select>
              </div>

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
            actions={[
              <a
                key="list-loadmore-more"
                onClick={() => deleteLecture(item.id, item.subCourseId)}
              >
                löschen
              </a>,
            ]}
          >
            <List.Item.Meta
              title={props.course.name}
              description={`Der Kurse ist am ${moment(item.start * 1000).format(
                'HH:mm DD.MM.YYYY'
              )} und dauert ${item.duration} min.`}
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
