/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState } from 'react';
import { Select, Divider, Input } from 'antd';
import { CertificateData } from '../Modals/CerificateModal';
import Button from '../button';

import classes from './ActivityForm.module.scss';
import Icons from '../../assets/icons';

const { Option } = Select;

interface Props {
  certificateData: CertificateData;
  setCertificateData: (data: CertificateData) => void;
}

const initialActivities = [
  'Vorbereitung, Planung und Gestaltung von Unterrichtsstunden',
  'Bearbeitung und Vermittlung von Unterrichtsinhalten',
  'Digitale Aufbereitung und Veranschaulichung von Unterrichtsinhalten',
  'Vertiefung und Wiederholung von Unterrichtsinhalten',
  'Gemeinsame Bearbeitung von Übungs- und Hausaufgaben',
  'Korrektur von Übungs- und Hausaufgaben',
  'Digitale Unterstützung bei der Prüfungsvorbereitung',
  'Digitale Unterstützung beim Lernen',
  'Begleitung auf dem Weg zum selbstständigen Lernen',
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ActivityForm = ({ certificateData, setCertificateData }: Props) => {
  const [activityName, setActivityName] = useState('');
  const [activitesOptions, setActivitiesOptions] = useState([0]);
  const [activityList, setActivityList] = useState(initialActivities);

  const addItem = () => {
    setActivityList([...activityList, activityName]);
    setActivityName('');
  };

  const deleteItem = (i: number) => {
    const newOptions = activitesOptions.filter(
      (_, k) => k !== activitesOptions.length - 1
    );

    const newActivites = certificateData.activities.filter((_, k) => k !== i);
    if (activitesOptions.length !== 5) {
      setActivitiesOptions(newOptions);
    }
    setCertificateData({
      ...certificateData,
      activities: newActivites,
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderDropdown = (menu: any) => {
    return (
      <div>
        {menu}
        <Divider style={{ margin: '4px 0' }} />
        <div className={classes.inputContainer}>
          <Input
            onKeyUp={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addItem();
              }
            }}
            className={classes.inputField}
            value={activityName}
            onChange={(e) => setActivityName(e.target.value)}
          />
          <span className={classes.addLink} onClick={addItem}>
            Hinzufügen
          </span>
        </div>
      </div>
    );
  };

  return (
    <>
      {activitesOptions.map((i) => {
        return (
          <div className={classes.selectContainer}>
            <Select
              value={certificateData.activities[i]}
              dropdownRender={renderDropdown}
              onChange={(v: string) => {
                const newActivies: string[] = [
                  ...certificateData.activities.filter((_, k) => k !== i),
                  v,
                ];
                setCertificateData({
                  ...certificateData,
                  activities: newActivies,
                });
                if (activitesOptions.length < 5) {
                  setActivitiesOptions([
                    ...activitesOptions,
                    activitesOptions.length,
                  ]);
                }
              }}
              placeholder="Wähle eine Tätigkeit aus"
              style={{ width: '100%' }}
            >
              {activityList
                .filter((a) => !certificateData.activities.includes(a))
                .map((a) => {
                  return <Option value={a}>{a}</Option>;
                })}
            </Select>
            {certificateData.activities[i] && (
              <Button
                backgroundColor="#F4F6FF"
                color="#4E6AE6"
                className={classes.buttonStyle}
                onClick={() => deleteItem(i)}
              >
                <Icons.Delete />
              </Button>
            )}
          </div>
        );
      })}
    </>
  );
};

export default ActivityForm;
