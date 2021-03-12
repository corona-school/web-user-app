import React, { useState } from 'react';
import { Row, Col, Form, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

interface SearchParticipantProps {
  inputValue: (value: string) => void;
}

const SearchParticipant: React.FC<SearchParticipantProps> = React.memo(({ inputValue }) => {
  const [enteredFilter, setEnteredFilter] = useState('');

  const inputHandler = (e) => {
    inputValue(e.target.value);
    setEnteredFilter(e.target.value);
  };
  return (
    <div>

          <Form>
            <Form.Item label="Suche:">
              <Input
                size="middle"
                placeholder="Vorname, Nachname, Note"
                prefix={<SearchOutlined />}
                defaultValue={enteredFilter}
                onChange={(event) => inputHandler(event)}
              />
            </Form.Item>
          </Form>
       
    </div>
  );
});

export default SearchParticipant;
