/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useContext } from 'react';
import Button from '../button';
import { Form, InputNumber, Switch, List, message } from 'antd';
import Context from '../../context';

import classes from './CreateSubCourse.module.scss';
import { SubCourse } from '../../types/Course';
import { CompletedCourse } from '../../routes/CourseForm';

export interface CompletedSubCourse extends SubCourse {
  id: number;
}

interface Props {
  courses: CompletedSubCourse[];
  course: CompletedCourse;
  next: () => void;
  onSuccess: (subCourse: CompletedSubCourse) => void;
}

export const CreateSubCourse: React.FC<Props> = (props) => {
  const [minGrade, setMinGrade] = useState(null);
  const [maxGrade, setMaxGrade] = useState(null);
  const [maxParticipants, setMaxParticipants] = useState(null);
  const [joinAfterStart, setJoinAfterStart] = useState(false);
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
            ({ getFieldValue }) => ({
              validator() {
                if (minGrade && maxGrade && maxParticipants) {
                  return Promise.resolve();
                }
                return Promise.reject('Du musst die Klassen begrenzen.');
              },
            }),
          ]}
        >
          Von Klasse
          <InputNumber
            style={{ margin: '0px 4px', width: '64px' }}
            onChange={(v) => setMinGrade(v)}
            min={1}
            max={maxGrade || 13}
            placeholder="5"
            value={minGrade}
          />
          bis zu Klasse
          <InputNumber
            style={{ margin: '0px 4px', width: '64px' }}
            onChange={(v) => setMaxGrade(v)}
            min={minGrade || 1}
            max={13}
            placeholder="7"
            value={maxGrade}
          />
          mit maximal
          <InputNumber
            onChange={(v) => setMaxParticipants(v)}
            style={{ margin: '0px 4px', width: '64px' }}
            min={1}
            max={99}
            placeholder="14"
          />{' '}
          Teilnehmer.
        </Form.Item>

        <Form.Item className={classes.formItem} name="joinAfterStart">
          <Switch
            style={{ margin: '0px 4px' }}
            onChange={(v) => {
              setJoinAfterStart(v);
            }}
          />
          Teilnehmer dürfen nach Kursbeginn beitreten
        </Form.Item>
      </div>
    );
  };

  const handleCourseCreation = async () => {
    try {
      setLoading(true);
      await form.validateFields();

      const subCourse: SubCourse = {
        instructors: [],
        minGrade,
        maxGrade,
        maxParticipants: maxParticipants,
        joinAfterStart: joinAfterStart,
        published: false,
      };

      apiContext
        .createSubCourse(props.course.id, subCourse)
        .then((id) => {
          setLoading(false);
          props.onSuccess({
            ...subCourse,
            id,
          });
        })
        .catch((err) => {
          message.error(
            'Ein Fehler ist aufgetreten. Bitte versuche es später erneut.'
          );
          setLoading(false);
          console.log(err);
        });
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  const deleteSubCourse = (id: number) => {};

  const renderSubCourses = () => {
    return (
      <List
        itemLayout="horizontal"
        header="Liste von Unterkursen"
        dataSource={props.courses}
        loading={loading}
        bordered
        footer={
          <div className={classes.footerContainer}>
            <div className="ant-list-footer">Unterkurs hinzufügen</div>
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
            actions={[
              <a
                key="list-loadmore-more"
                onClick={() => deleteSubCourse(item.id)}
              >
                löschen
              </a>,
            ]}
          >
            <List.Item.Meta
              title={props.course.name}
              description={`${item.minGrade}-${item.maxGrade} Klasse für ${item.maxParticipants} Schüler*innen`}
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
        Weiter
      </Button>
    </Form>
  );
};
