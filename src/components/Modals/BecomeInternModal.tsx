import React, { useContext, useState } from 'react';
import StyledReactModal from 'styled-react-modal';
import ClipLoader from 'react-spinners/ClipLoader';
import { Title } from '../Typography';
import Button from '../button';
import { ModalContext } from '../../context/ModalContext';
import { User } from '../../types';
import { Input, message, Form, Select, InputNumber } from 'antd';
import { ApiContext } from '../../context/ApiContext';
import { BecomeIntern } from '../../types/Instructor';
import { UserContext } from '../../context/UserContext';
import { dev } from '../../api/config';

import classes from './BecomeInternModal.module.scss';

const { Option } = Select;

interface Props {
  user: User;
}

const BecomeInternModal: React.FC<Props> = (props) => {
  const [loading, setLoading] = useState(false);

  const modalContext = useContext(ModalContext);
  const userContext = useContext(UserContext);
  const api = useContext(ApiContext);

  const onFinish = (onFinish) => {
    if (
      !onFinish.description ||
      !onFinish.university ||
      !onFinish.hours ||
      !onFinish.state ||
      !onFinish.subjects
    ) {
      if (dev) console.log('Not all forms filled', onFinish);
      return null;
    }

    setLoading(true);

    const data: BecomeIntern = {
      msg: onFinish.description,
      isOfficial: true,
      university: onFinish.university,
      hours: onFinish.hours,
      state: onFinish.state,
      module: 'internship',
      subjects: onFinish.subjects.map((s) => ({ name: s })),
    };

    api
      .becomeInstructor(data)
      .then(() => {
        message.success('Du wurdest als Kursleiter*in angemeldet.');
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
      <StyledReactModal isOpen={modalContext.openedModal === 'startInternship'}>
        <div className={classes.modal}>
          <Title size="h2">Praktikum anmelden</Title>
          <ClipLoader size={100} color={'#123abc'} loading={true} />
          <div className={classes.buttonContainer}>
            <Button backgroundColor="#F4F6FF" color="#4E6AE6">
              Anmelden
            </Button>
          </div>
        </div>
      </StyledReactModal>
    );
  }

  return (
    <StyledReactModal
      isOpen={modalContext.openedModal === 'startInternship'}
      onBackgroundClick={() => modalContext.setOpenedModal(null)}
    >
      <div className={classes.modal}>
        <Title size="h2">Praktikum anmelden</Title>
        <Form
          onFinish={onFinish}
          className={classes.formContainer}
          layout="vertical"
          name="basic"
          initialValues={{ remember: true }}
        >
          <Form.Item
            className={classes.formItem}
            label="Derzeitiges Bundesland"
            name="state"
            rules={[
              { required: true, message: 'Bitte trage dein Bundesland ein' },
            ]}
          >
            <Select
              showSearch
              placeholder="Baden-Württemberg"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              <Option value="BW">Baden-Württemberg</Option>
              <Option value="BY">Bayern</Option>
              <Option value="BE">Berlin</Option>
              <Option value="BB">Brandenburg</Option>
              <Option value="HB">Bremen</Option>
              <Option value="HH">Hamburg</Option>
              <Option value="HE">Hessen</Option>
              <Option value="MV">Mecklenburg-Vorpommern</Option>
              <Option value="NI">Niedersachsen</Option>
              <Option value="NW">Nordrhein-Westfalen</Option>
              <Option value="RP">Rheinland-Pfalz</Option>
              <Option value="SL">Saarland</Option>
              <Option value="SN">Sachsen</Option>
              <Option value="ST">Sachsen-Anhalt</Option>
              <Option value="SH">Schleswig-Holstein</Option>
              <Option value="TH">Thüringen</Option>
              <Option value="other">anderes Bundesland</Option>
            </Select>
          </Form.Item>

          <Form.Item
            className={classes.formItem}
            label="In welchen Fächern kannst du Schüler*innen unterstützen? "
            name="subjects"
            rules={[
              {
                required: true,
                message: 'Bitte trage deine Fächer ein',
              },
            ]}
          >
            <Select
              mode="multiple"
              placeholder="Bitte, wähle deine Fächer aus."
            >
              <Option value="Deutsch">Deutsch</Option>
              <Option value="Englisch">Englisch</Option>
              <Option value="Französisch">Französisch</Option>
              <Option value="Spanisch">Spanisch</Option>
              <Option value="Latein">Latein</Option>
              <Option value="Italienisch">Italienisch</Option>
              <Option value="Russisch">Russisch</Option>
              <Option value="Altgriechisch">Altgriechisch</Option>
              <Option value="Niederländisch">Niederländisch</Option>
              <Option value="Mathematik">Mathematik</Option>
              <Option value="Biologie">Biologie</Option>
              <Option value="Physik">Physik</Option>
              <Option value="Chemie">Chemie</Option>
              <Option value="Informatik">Informatik</Option>
              <Option value="Geschichte">Geschichte</Option>
              <Option value="Politik">Politik</Option>
              <Option value="Wirtschaft">Wirtschaft</Option>
              <Option value="Erdkunde">Erdkunde</Option>
              <Option value="Philosophie">Philosophie</Option>
              <Option value="Musik">Musik</Option>
              <Option value="Pädagogik">Pädagogik</Option>
              <Option value="Kunst">Kunst</Option>
            </Select>
          </Form.Item>

          <Form.Item
            className={classes.formItem}
            label="Universität/Hochschule"
            name="university"
            rules={[
              { required: true, message: 'Bitte trage deine Universität ein' },
            ]}
          >
            <Input placeholder="Duale Hochschule Musterstadt" />
          </Form.Item>

          <Form.Item
            className={classes.formItem}
            label="Aufwand des Moduls (in Stunden)"
            name="hours"
            rules={[
              {
                required: true,
                message: 'Bitte trage dein zeitlichen Aufwand ein',
              },
            ]}
          >
            <InputNumber placeholder="40h" min={1} max={500} />
          </Form.Item>

          <Form.Item
            className={classes.formItem}
            label="Beschreibe die Inhalte deines Gruppenkurses (3-5 Sätze)"
            name="description"
            rules={[
              {
                required: true,
                message:
                  'Beschreibe die Inhalte deines Gruppenkurses (3-5 Sätze)',
              },
            ]}
          >
            <Input.TextArea
              autoSize={{ minRows: 6 }}
              placeholder={'Kursthema, Zielgruppe, Kursgröße, Interaktion'}
            />
          </Form.Item>
          <div className={classes.buttonContainer}>
            <Button backgroundColor="#F4F6FF" color="#4E6AE6" type="submit">
              Anmelden
            </Button>
          </div>
        </Form>
      </div>
    </StyledReactModal>
  );
};

export default BecomeInternModal;
