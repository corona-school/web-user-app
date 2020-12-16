import React, { useContext, useState } from 'react';
import StyledReactModal from 'styled-react-modal';
import { Form, message, Input } from 'antd';
import ClipLoader from 'react-spinners/ClipLoader';
import { ModalContext } from '../../context/ModalContext';
import { ApiContext } from '../../context/ApiContext';

import classes from './ConfirmPhone.module.scss';
import { Title } from '../Typography';
import { ConfirmPhone } from '../../types/ConfirmPhone';
import Button from '../button';
import { UserContext } from '../../context/UserContext';
import { dev } from '../../api/config';
import { User } from '../../types';

interface Props {
  user: User;
}

const ConfirmPhoneModal: React.FC<Props> = ({ user }) => {
  const [loading, setLoading] = useState(false);

  const modalContext = useContext(ModalContext);
  const userContext = useContext(UserContext);
  const api = useContext(ApiContext);

  const onFinish = (onFinish) => {
    setLoading(true);

    const confirmPhoneData: ConfirmPhone = {
      code: onFinish.code,
      wixId: user.id,
    };

    api
      .postConfirmPhone(confirmPhoneData)
      .then(() => {
        message.success('Deine Telefonummer wurde bestätigt.');
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
      <StyledReactModal isOpen={modalContext.openedModal === 'ConfirmPhone'}>
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
      isOpen={modalContext.openedModal === 'ConfirmPhone'}
      onBackgroundClick={() => modalContext.setOpenedModal(null)}
    >
      <div className={classes.modal}>
        <Title size="h2">Telefonnummer bestätigen</Title>
        <Form
          onFinish={onFinish}
          className={classes.formContainer}
          layout="vertical"
          name="basic"
        >
          <Form.Item
            className={classes.formItem}
            label="SMS Bestätigungs Code"
            name="code"
            rules={[
              {
                required: true,
                message: 'Bitte gebe den SMS Bestätigungs Code ein.',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <div className={classes.buttonContainer}>
              <Button type="submit">Bestätigen</Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </StyledReactModal>
  );
};

export default ConfirmPhoneModal;
