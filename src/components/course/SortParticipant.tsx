import React, { useState } from 'react';
import { Button as AntdButton } from 'antd';
import Icons from '../../assets/icons';
import classes from './SortParticipant.module.scss';
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

    return (
      <>
        <div className={classes.sortParticipant}>
          <ul>
            <li>
              <p style={{ paddingTop: '5px' }}>Sortieren:</p>
            </li>
            <li>
              <AntdButton onClick={() => sort('firstname')}>
                Vorname
                <Icons.SortSolid
                  style={{ marginLeft: '5px', height: '12px' }}
                />
              </AntdButton>
            </li>
            <li>
              <AntdButton onClick={() => sort('lastname')}>
                Nachname
                <Icons.SortSolid
                  style={{ marginLeft: '5px', height: '12px' }}
                />
              </AntdButton>
            </li>
            <li>
              <AntdButton onClick={() => sort('email')}>
                E-Mail-Addresse
                <Icons.SortSolid
                  style={{ marginLeft: '5px', height: '12px' }}
                />
              </AntdButton>
            </li>
            <li>
              <AntdButton onClick={() => sort('grade')}>
                Klasse
                <Icons.SortSolid
                  style={{ marginLeft: '5px', height: '12px' }}
                />
              </AntdButton>
              <li>
                <AntdButton onClick={() => sort('schooltype')}>
                  Schultyp
                  <Icons.SortSolid
                    style={{ marginLeft: '5px', height: '12px' }}
                  />
                </AntdButton>
              </li>
            </li>
          </ul>
        </div>
      </>
    );
  }
);

export default SortParticipant;
