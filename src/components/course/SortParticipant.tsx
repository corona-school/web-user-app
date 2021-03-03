import React, { useState } from 'react';
import { Dropdown, Button, Menu } from 'antd';
import { SortAscendingOutlined } from '@ant-design/icons';
import { CourseParticipant } from '../../types/Course';

interface SortParticipantProps {
  setParticipantList: (val: CourseParticipant[]) => void;
  getParticipantList: CourseParticipant[];
}

const SortParticipant: React.FC<SortParticipantProps> = React.memo(
  ({ setParticipantList, getParticipantList }) => {
    const [orderBool, setOrderBool] = useState(true);
    const compareValues = (key, order = 'asc') =>
      function innerSort(a, b) {
        if (!a[key] || !b[key]) {
          return 0;
        }

        const varA = typeof a[key] === 'string' ? a[key].toUpperCase() : a[key];
        const varB = typeof b[key] === 'string' ? b[key].toUpperCase() : b[key];
        let comparison = 0;
        if (varA > varB) {
          comparison = 1;
        } else if (varA < varB) {
          comparison = -1;
        }
        return order === 'desc' ? comparison * -1 : comparison;
      };

    const sort = (key) => {
      setOrderBool(!orderBool);
      const sortParticipants = [...getParticipantList];
      sortParticipants.sort(compareValues(key, orderBool ? 'asc' : 'desc'));
      setParticipantList(sortParticipants);
    };

    const menu = (
      <Menu onClick={(e) => sort(e.key)}>
        <Menu.Item key="firstname">Vorname</Menu.Item>
        <Menu.Item key="lastname">Nachname</Menu.Item>
        <Menu.Item key="grade">Klasse</Menu.Item>
      </Menu>
    );

    return (
      <Dropdown overlay={menu} placement="bottomLeft" arrow>
        <Button style={{ width: '100%' }}>
          Teilnehmer sortieren <SortAscendingOutlined />
        </Button>
      </Dropdown>
    );
  }
);

export default SortParticipant;
