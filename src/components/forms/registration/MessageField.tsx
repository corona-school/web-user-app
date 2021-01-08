import { Form, Input } from 'antd';
import React from 'react';

interface Props {
  className: string;
  isGroups?: boolean;
  isJufo?: boolean;
}

export const MessageField: React.FC<Props> = (props) => {
  const getLabel = () => {
    if (props.isGroups) {
      return 'Beschreibe die Inhalte deines Gruppenkurses bzw. deiner Gruppenkurse (3-5 Sätze)';
    }
    if (props.isJufo) {
      return 'Stelle dich kurz vor.';
    }
    return 'Nachricht hinzufügen';
  };

  const getPlaceholder = () => {
    if (props.isGroups) {
      return 'Kursthema, Zielgruppe, Kursgröße, Interaktion';
    }
    if (props.isJufo) {
      return 'Stelle dich kurz vor.';
    }
    return 'Hier deine Nachricht für uns.';
  };

  return (
    <Form.Item className={props.className} label={getLabel()} name="msg">
      <Input.TextArea
        autoSize={{ minRows: props.isGroups ? 6 : 4 }}
        placeholder={getPlaceholder()}
      />
    </Form.Item>
  );
};
