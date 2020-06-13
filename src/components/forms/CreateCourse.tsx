import React, { useState, useContext } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import Button from '../button';
import { Form, Input, Radio, Select } from 'antd';
import Context from '../../context';

import classes from './CreateCourse.module.scss';
import { Course } from '../../types/Course';
import { CompletedCourse } from '../../routes/CourseForm';

const { Option } = Select;

interface Props {
  onSuccess: (courseId: CompletedCourse) => void;
}

const revisionTags = [
  'easy',
  'medium',
  'difficult',
  'Mathematics',
  'English',
  'German',
];

const clubTags = [
  'Spiel & Spaß',
  'Kreativität',
  'Sport & Bewegung',
  'Naturwissenschaften',
  'Musik',
  'Gesundheit',
  'Interkulturelles',
];

const coachingTags = [
  'Prüfungsvorbereitung',
  'Selbstsorganisation',
  'Persönlichkeitsbildung',
];

const tags = new Map([
  ['revision', revisionTags],
  ['club', clubTags],
  ['coaching', coachingTags],
]);

export const CreateCourse: React.FC<Props> = (props) => {
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState('revision');
  const [form] = Form.useForm();
  const apiContext = useContext(Context.Api);

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
          rules={[
            { required: true, message: 'Bitte trage eine Beschreibung ein' },
          ]}
        >
          <Input placeholder="Ich erkläre euch wie ihr schwierige Mathe Probleme löst" />
        </Form.Item>
        <Form.Item
          className={classes.formItem}
          label="Beschreibung"
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
        <Form.Item className={classes.formItem} label="Tags" name="tags">
          <Select
            mode="multiple"
            placeholder="Ergänze hier Tags damit dein Kurs besser gefunden werden kann"
          >
            {tags.get(category)?.map((tag) => {
              return <Option value={tag}>{tag}</Option>;
            })}
          </Select>
        </Form.Item>
      </>
    );
  };

  const handleCourseCreation = async () => {
    try {
      setLoading(true);
      const formValues = await form.validateFields();
      const course: Course = {
        instructors: [],
        name: formValues.name,
        outline: formValues.outline,
        description: formValues.description,
        category: formValues.category,
        tags: formValues.tags || [],
        submit: false,
      };
      console.log(course);

      apiContext
        .createCourse(course)
        .then((id) => {
          setLoading(false);
          props.onSuccess({ ...course, id });
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
        });
    } catch (err) {
      setLoading(false);
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

      <Button
        onClick={handleCourseCreation}
        className={classes.button}
        color="white"
        backgroundColor="#4E6AE6"
      >
        Erstellen
      </Button>
    </Form>
  );
};
