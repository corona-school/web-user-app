import React, { useState, useContext, useEffect } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import { Form, Input, Radio, Select, InputNumber, Switch, message } from 'antd';
import Context from '../../context';

import classes from './CreateCourse.module.scss';
import { Course, SubCourse, Tag } from '../../types/Course';
import { CompletedCourse } from '../../routes/CourseForm';
import { dev } from '../../api/config';
import AccentColorButton from '../button/AccentColorButton';

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

export const CreateCourse: React.FC<Props> = (props) => {
  const [outline, setOutline] = useState(
    props.course ? props.course.outline : null
  );
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

  const [editTags, setEditTags] = useState(
    props.course?.tags ? props.course?.tags : []
  );

  const [availableTags, setAvailableTags] = useState<Tag[]>([]);

  const [form] = Form.useForm();
  const apiContext = useContext(Context.Api);

  useEffect(() => {
    apiContext
      .getCourseTags()
      .then((response) => {
        setAvailableTags(response);
      })
      .catch((error) => {
        if (dev) console.error(error);
      });
  }, [apiContext, setAvailableTags]);

  const renderSubCourseForm = () => {
    return (
      <>
        <Form.Item
          label="Beschränkungen (Klasse, Teilnehmer)"
          className={classes.formItem}
          name="class"
          rules={[
            () => ({
              required: true,
              validator() {
                if (!minGrade || !maxGrade || !maxParticipants) {
                  return Promise.reject('Bitte fülle alle Felder aus.');
                }
                if (minGrade > maxGrade) {
                  return Promise.reject(
                    `Bitte begrenze die Klassen von niedrigste bis höchste Klasse.`
                  );
                }
                if (maxParticipants < 3) {
                  return Promise.reject(
                    'Die Anzahl an Teilnehmer muss mindestens 3 sein.'
                  );
                }
                return Promise.resolve();
              },
            }),
          ]}
        >
          Von Klasse
          <InputNumber
            style={{ margin: '0px 4px', width: '64px' }}
            onChange={(v) => setMinGrade(Number(v))}
            min={1}
            max={13}
            placeholder="5"
            value={minGrade}
          />
          bis zu Klasse
          <InputNumber
            style={{ margin: '0px 4px', width: '64px' }}
            onChange={(v) => setMaxGrade(Number(v))}
            min={1}
            max={13}
            placeholder="7"
            value={maxGrade}
          />
          mit maximal
          <InputNumber
            value={maxParticipants}
            onChange={(v) => setMaxParticipants(Number(v))}
            style={{ margin: '0px 4px', width: '64px' }}
            min={3}
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

  const getOutlineHelp = () => {
    if (!outline) {
      return 'Die Beschreibung darf nicht länger als 140 Zeichen sein.';
    }
    if (outline.length > 140) {
      return null;
    }

    return `Du hast noch ${outline.length}/140 Zeichen.`;
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
            { max: 100, message: 'Bitte beschränke dich auf 100 Zeichen' },
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
            {
              max: 140,
              required: true,
              message: 'Bitte beschränke dich auf 140 Zeichen',
            },
          ]}
          help={getOutlineHelp()}
        >
          <Input
            value={outline}
            onChange={(v) => {
              setOutline(v.target.value);
            }}
            placeholder="Ich erkläre euch wie ihr schwierige Mathe Probleme löst"
          />
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
              setCategory(v.target.value);
              setEditTags([]);
              form.resetFields(['tags']);
            }}
          >
            <Radio style={radioStyle} value="revision">
              Repetitorien
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
          initialValue={editTags}
        >
          <Select
            onChange={(v: string[]) => {
              setEditTags(v);
            }}
            mode="multiple"
            placeholder="Ergänze hier Tags damit dein Kurs besser gefunden werden kann"
          >
            {availableTags
              .filter((t) => t.category === category || t.category === 'other')
              .map((tag) => {
                return <Option value={tag.id}>{tag.name}</Option>;
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
        submit: props.course?.submit ?? false,
        image: props.course?.image,
      };
      const subCourse: SubCourse = {
        instructors: props.subCourse ? props.subCourse.instructors : [],
        minGrade,
        maxGrade,
        maxParticipants,
        joinAfterStart: !!joinAfterStart,
        published: props.subCourse?.published ?? false,
      };

      if (dev) {
        console.log({ course, subCourse, edit: props.edit });
      }

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
      if (dev) {
        console.error(err);
      }
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
          <ClipLoader size={100} color="#123abc" loading />
        </div>
      )}

      <div className={classes.buttonContainer}>
        <AccentColorButton
          accentColor="#4E6AE6"
          label={props.edit ? 'Bearbeiten' : 'Erstellen'}
          onClick={handleCourseCreation}
        />
      </div>
    </Form>
  );
};
