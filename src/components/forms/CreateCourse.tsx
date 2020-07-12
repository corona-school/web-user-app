import React, { useState, useContext } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import Button from '../button';
import { Form, Input, Radio, Select, InputNumber, Switch, message } from 'antd';
import Context from '../../context';

import classes from './CreateCourse.module.scss';
import { Course, SubCourse } from '../../types/Course';
import { CompletedCourse } from '../../routes/CourseForm';

const { Option } = Select;

export interface CompletedSubCourse extends SubCourse {
  id: number;
}

interface Props {
  edit?: boolean;
  course?: CompletedCourse;
  subCourse?: CompletedSubCourse;
  onSuccess: () => void;
  setCourse: (course: CompletedCourse) => void;
  setSubCourse: (subCourse: CompletedSubCourse) => void;
}

export const revisionTags = [
  { name: 'easy', identifier: 'easy' },
  { name: 'medium', identifier: 'medium' },
  { name: 'difficult', identifier: 'difficult' },
  { name: 'Mathematik', identifier: 'Mathematics' },
  { name: 'Englisch', identifier: 'English' },
  { name: 'Deutsch', identifier: 'German' },
];

export const clubTags = [
  { name: 'Spiel & Spaß', identifier: 'play&fun' },
  { name: 'Kreativität', identifier: 'creativity' },
  { name: 'Sport & Bewegung', identifier: 'sports' },
  { name: 'Naturwissenschaften', identifier: 'science' },
  { name: 'Musik', identifier: 'music' },
  { name: 'Gesundheit', identifier: 'health' },
  { name: 'Interkulturelles', identifier: 'intercultural' },
];

export const coachingTags = [
  { name: 'Prüfungsvorbereitung', identifier: 'preparation' },
  { name: 'Selbstsorganisation', identifier: 'organisation' },
  { name: 'Persönlichkeitsbildung', identifier: 'personality' },
];

export const tags = new Map([
  ['revision', revisionTags],
  ['club', clubTags],
  ['coaching', coachingTags],
]);

export const CreateCourse: React.FC<Props> = (props) => {
  const [minGrade, setMinGrade] = useState(
    props.subCourse ? props.subCourse.minGrade : null
  );
  const [maxGrade, setMaxGrade] = useState(
    props.subCourse ? props.subCourse.maxGrade : null
  );
  const [maxParticipants, setMaxParticipants] = useState(
    props.subCourse ? props.subCourse.maxParticipants : null
  );
  const [joinAfterStart, setJoinAfterStart] = useState(
    props.subCourse ? props.subCourse.joinAfterStart : null
  );
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState(
    props.course ? props.course.category : 'revision'
  );
  const [form] = Form.useForm();
  const apiContext = useContext(Context.Api);

  const renderSubCourseForm = () => {
    return (
      <>
        <Form.Item
          label="Beschränkungen (Klasse, Teilnehmer)"
          className={classes.formItem}
          name="class"
          rules={[
            ({ getFieldValue }) => ({
              required: true,
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
            onChange={(v) => setMinGrade(Number(v))}
            min={1}
            max={maxGrade || 13}
            placeholder="5"
            value={minGrade}
          />
          bis zu Klasse
          <InputNumber
            style={{ margin: '0px 4px', width: '64px' }}
            onChange={(v) => setMaxGrade(Number(v))}
            min={minGrade || 1}
            max={13}
            placeholder="7"
            value={maxGrade}
          />
          mit maximal
          <InputNumber
            value={maxParticipants}
            onChange={(v) => setMaxParticipants(Number(v))}
            style={{ margin: '0px 4px', width: '64px' }}
            min={1}
            max={99}
            placeholder="14"
          />{' '}
          Teilnehmer.
        </Form.Item>

        <Form.Item
          className={classes.formItem}
          name="joinAfterStart"
          label="Sonstiges"
        >
          <Switch
            style={{ margin: '0px 4px' }}
            checked={joinAfterStart}
            onChange={(v) => {
              setJoinAfterStart(v);
            }}
          />
          Teilnehmer dürfen nach Kursbeginn beitreten
        </Form.Item>
      </>
    );
  };

  const renderFormItems = () => {
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };
    return (
      <>
        <Form.Item
          className={classes.formItem}
          label="Kursname"
          name="name"
          initialValue={props.course?.name}
          rules={[
            { required: true, message: 'Bitte trage einen Kursnamen ein' },
          ]}
        >
          <Input placeholder="Mathematik Hilfe" />
        </Form.Item>

        <Form.Item
          className={classes.formItem}
          label="Kurze Erklärung"
          name="outline"
          initialValue={props.course?.outline}
          rules={[
            { required: true, message: 'Bitte trage eine Beschreibung ein' },
          ]}
        >
          <Input placeholder="Ich erkläre euch wie ihr schwierige Mathe Probleme löst" />
        </Form.Item>
        <Form.Item
          className={classes.formItem}
          label="Beschreibung"
          initialValue={props.course?.description}
          name="description"
          rules={[
            { required: true, message: 'Bitte trage eine Beschreibung ein' },
          ]}
        >
          <Input.TextArea
            autoSize={{ minRows: 2, maxRows: 6 }}
            placeholder="Ich erkläre euch wie ihr schwierige Mathe Probleme löst"
          />
        </Form.Item>
        <Form.Item
          className={classes.formItem}
          label="Kategorie"
          name="category"
          initialValue={props.course?.category}
          rules={[
            { required: true, message: 'Bitte wähle eine Kategorie aus' },
          ]}
        >
          <Radio.Group
            onChange={(v) => {
              form.resetFields(['tags']);
              setCategory(v.target.value);
            }}
          >
            <Radio style={radioStyle} value="revision">
              Repititorien
            </Radio>
            <Radio style={radioStyle} value="club">
              AGs
            </Radio>
            <Radio style={radioStyle} value="coaching">
              Lern-Coaching
            </Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          className={classes.formItem}
          label="Tags"
          name="tags"
          initialValue={props.course?.tags}
        >
          <Select
            mode="multiple"
            placeholder="Ergänze hier Tags damit dein Kurs besser gefunden werden kann"
          >
            {tags.get(category)?.map((tag) => {
              return <Option value={tag.identifier}>{tag.name}</Option>;
            })}
          </Select>
        </Form.Item>

        {renderSubCourseForm()}
      </>
    );
  };

  const handleCourseCreation = async () => {
    try {
      setLoading(true);
      const formValues = await form.validateFields();
      const course: Course = {
        instructors: props.course ? props.course.instructors : [],
        name: formValues.name,
        outline: formValues.outline,
        description: formValues.description,
        category: formValues.category,
        tags: formValues.tags || [],
        submit: false,
      };
      const subCourse: SubCourse = {
        instructors: props.subCourse ? props.subCourse.instructors : [],
        minGrade,
        maxGrade,
        maxParticipants: maxParticipants,
        joinAfterStart: joinAfterStart,
        published: false,
      };
      console.log(course, subCourse);

      if (props.edit && props.course) {
        await apiContext.editCourse(props.course.id, course);
        props.setCourse({ ...course, id: props.course.id });

        if (props.subCourse) {
          await apiContext.editSubCourse(props.course.id, {
            ...subCourse,
            id: props.subCourse.id,
          });
          props.setSubCourse({ ...subCourse, id: props.subCourse.id });
        } else {
          const subCourseId = await apiContext.createSubCourse(
            props.course.id,
            subCourse
          );
          props.setSubCourse({ ...subCourse, id: subCourseId });
        }

        setLoading(false);
        props.onSuccess();
        return;
      }

      const courseId = await apiContext.createCourse(course);
      props.setCourse({ ...course, id: courseId });

      const subCourseId = await apiContext.createSubCourse(courseId, subCourse);
      props.setSubCourse({ ...subCourse, id: subCourseId });

      setLoading(false);
      props.onSuccess();
    } catch (err) {
      setLoading(false);
      message.error('Ein Fehler ist aufgetreten.');
      console.log(err);
    }
  };

  return (
    <Form
      form={form}
      className={classes.formContainer}
      layout="vertical"
      name="basic"
      initialValues={{ remember: true }}
    >
      {!loading ? (
        renderFormItems()
      ) : (
        <div className={classes.loadingContainer}>
          <ClipLoader size={100} color={'#123abc'} loading={true} />
        </div>
      )}

      <div className={classes.buttonContainer}>
        <Button
          onClick={handleCourseCreation}
          className={classes.button}
          color="white"
          backgroundColor="#4E6AE6"
        >
          {props.edit ? 'Bearbeiten' : 'Erstellen'}
        </Button>
      </div>
    </Form>
  );
};
