/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useContext } from 'react';
import Button from '../button';
import { Form, InputNumber, List, Select, DatePicker } from 'antd';
import Context from '../../context';
import { CompletedSubCourse } from './CreateSubCourse';
import { Lecture } from '../../types/Course';
import { CompletedCourse } from '../../routes/CourseForm';

import classes from './CreateLecture.module.scss';

const { Option } = Select;

interface Props {
  lectures: any[];
  subCourses: CompletedSubCourse[];
  course: CompletedCourse;
  next: () => void;
  onSuccess: (subCourse: CompletedSubCourse) => void;
}

export const CreateLecture: React.FC<Props> = (props) => {
  const [start, setStart] = useState(null);
  const [duration, setDuration] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedSubCourse, setSelectedSubCourse] = useState(null);
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
                if (start && duration) {
                  return Promise.resolve();
                }
                return Promise.reject('Du musst die Klassen begrenzen.');
              },
            }),
          ]}
        >
          Der Kurs ist am
          <DatePicker style={{ margin: '0px 4px' }} placeholder="25.06.2020" />
          und dauert
          <InputNumber
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
      const formValues = await form.validateFields();

      console.log(formValues);
      const lecture: Lecture = {
        instructor: '',
        start,
        duration,
      };
      console.log(lecture);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  const deleteLecture = (id: number) => {};

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
                  placeholder="Wähle einen Kurs aus"
                >
                  <Option value="a">Kurs mit 5-10 Klasse</Option>
                  <Option value="b">Kurs mit 10-12 Klasse</Option>
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
                onClick={() => deleteLecture(item.id)}
              >
                löschen
              </a>,
            ]}
          >
            <List.Item.Meta
              title={props.course.name}
              description={`Der Kurse ist am ${item.start} und dauert ${item.duration}`}
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
