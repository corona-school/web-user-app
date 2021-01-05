/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useContext } from 'react';
import { message, Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { UploadFile } from 'antd/lib/upload/interface';
import Button from '../button';
import Context from '../../context';
import { CompletedCourse } from '../../routes/CourseForm';

import classes from './EditCourseImage.module.scss';
import { AuthContext } from '../../context/AuthContext';
import { editCourseImageURL } from '../../api/api';

interface Props {
  course: CompletedCourse;
  next: () => void;
  onSuccess: (courseURL: string) => void;
  edit: boolean;
}

export const EditCourseImage: React.FC<Props> = (props) => {
  const fileListFromCourseImage = (course: CompletedCourse) => {
    if (!course.image) {
      return [];
    }
    return [
      {
        uid: '-1',
        name: 'Kurs-Cover',
        url: course.image,
        thumbUrl: course.image, // TODO use real thumbnail
        type: 'img/gif',
        size: 100,
      },
    ];
  };

  const [fileList, setFileList] = useState<UploadFile[]>(
    fileListFromCourseImage(props.course)
  );

  const apiContext = useContext(Context.Api);
  const authContext = useContext(AuthContext);

  const renderUpload = () => {
    return (
      <Upload.Dragger
        name="cover"
        multiple={false}
        method="PUT"
        headers={{
          token: authContext.credentials.token,
        }}
        action={editCourseImageURL(props.course.id)}
        accept="image/png,image/jpeg,image/gif"
        listType="picture"
        onRemove={async () => {
          try {
            await apiContext.deleteCourseImage(props.course.id); // TODO: error handling if deletion does not work
            setFileList([]);
            return true;
          } catch (e) {
            message.error(
              'Das Bild kann nicht gelöscht werden. Probiere es bitte später noch einmal.'
            );
            return false;
          }
        }}
        fileList={fileList}
        onChange={(info) => {
          if (!info.file.status) {
            setFileList([]); // files without status (e.g. failed uploads) should not be displayed
            return;
          }
          const file = { ...info.file, name: 'Kurs-Cover' }; // set default name

          switch (file.status) {
            case 'removed':
              props.onSuccess(null); // removed
              setFileList([]);
              return;
            case 'done': {
              // set course image url if upload is done
              const uploadURL = file.response?.imageURL;
              props.onSuccess(uploadURL);
              setFileList([{ ...file, url: uploadURL }]);
              break;
            }
            default:
              setFileList([file]);
              break;
          }
        }}
        beforeUpload={(file) => {
          // ensure file is not larger than 3MB
          if (file.size > 3 * 10 ** 6) {
            message.error(
              'Dieses Bild ist zu groß! Maximal 3 MB sind erlaubt!'
            );
            return false;
          }
          return true;
        }}
      >
        <div className={classes.dragContainer}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Klicke hier oder ziehe ein Bild hier hin
          </p>
          <p className="ant-upload-hint ">
            Unterstützt werden PNG-, JPEG- und GIF-Dateien. <br />
            Bitte wähle das Bild sorgfältig aus, es wird öffentlich mit deinem
            Kurs angezeigt.
          </p>
        </div>
      </Upload.Dragger>
    );
  };

  return (
    <>
      {renderUpload()}
      <Button
        onClick={props.next}
        className={classes.button}
        color="#4E6AE6"
        backgroundColor="white"
      >
        Weiter
      </Button>
    </>
  );
};
