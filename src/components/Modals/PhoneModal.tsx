import React, { useContext, useState } from 'react';
import StyledReactModal from 'styled-react-modal';
import { Form, message, Input } from 'antd';
import ClipLoader from 'react-spinners/ClipLoader';
import { ModalContext } from '../../context/ModalContext';
import { ApiContext } from '../../context/ApiContext';

import classes from './PhoneModal.module.scss';
import { Title } from '../Typography';
import { RequestCode, VerifyCode } from '../../types/Phone';
import Button from '../button';
import { UserContext } from '../../context/UserContext';
import { dev } from '../../api/config';
import { User } from '../../types';

interface Props {
  user: User;
}

const PhoneModal: React.FC<Props> = ({ user }) => {
  const [loading, setLoading] = useState(false);

  const modalContext = useContext(ModalContext);
  const userContext = useContext(UserContext);
  const api = useContext(ApiContext);

  const requestCode = () => {
    const requestCodeData: RequestCode = {
      wixId: user.id,
    };

    api
      .postRequestCode(requestCodeData)
      .then(() => {
        message.success(
          'Es wurde ein Verifizierungscode an deine Handynummer gesendet.'
        );
      })
      .catch((err) => {
        if (dev) console.error(err);
        message.error('Etwas ist schief gegangen.');
      });
  };

  const onFinish = (onFinish) => {
    setLoading(true);

    const verifyCodeData: VerifyCode = {
      code: onFinish.code,
      wixId: user.id,
    };

    api
      .postVerifyCode(verifyCodeData)
      .then(() => {
        message.success('Deine Handynummer wurde bestätigt.');
        modalContext.setOpenedModal(null);
        userContext.fetchUserData();
      })
      .catch((err) => {
        if (dev) console.error(err);
        message.error('Etwas ist schief gegangen.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (loading) {
    return (
      <StyledReactModal isOpen={modalContext.openedModal === 'Phone'}>
        <div className={classes.modal}>
          <Title size="h2">Telefonnummer bestätigen</Title>
          <ClipLoader size={100} color="#123abc" loading />
          <div className={classes.buttonContainer}>
            <Button backgroundColor="#F4F6FF" color="#4E6AE6">
              Bestätigen
            </Button>
          </div>
        </div>
      </StyledReactModal>
    );
  }

  return (
    <StyledReactModal
      isOpen={modalContext.openedModal === 'Phone'}
      onBackgroundClick={() => modalContext.setOpenedModal(null)}
    >
      <div className={classes.modal}>
        <Title size="h2">Handynummer verifizieren</Title>
        <div className={classes.buttonContainer}>
          <Button onClick={requestCode}>Code anfordern</Button>
        </div>
        <Form
          onFinish={onFinish}
          className={classes.formContainer}
          layout="vertical"
          name="basic"
        >
          <Form.Item
            className={classes.formItem}
            label="SMS Verifizierungscode"
            name="code"
            rules={[
              {
                required: true,
                message: 'Bitte gebe den SMS Verifizierungscode ein.',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <div className={classes.buttonContainer}>
              <Button type="submit">Verifizieren</Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </StyledReactModal>
  );
};

export default PhoneModal;
