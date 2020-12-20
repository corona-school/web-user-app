import { AutoComplete, Input } from 'antd';
import { SelectProps } from 'antd/lib/select';
import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ApiContext } from '../../context/ApiContext';
import { UserContext } from '../../context/UserContext';
import { Expert } from '../../types/Expert';
import { JufoExpertDetailCard } from '../cards/JufoExpertDetailCard';

import classes from './ExpertSearch.module.scss';

export const ExpertSearch: React.FC = () => {
  const location = useLocation();
  const userContext = useContext(UserContext);
  const api = useContext(ApiContext);

  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<
    // eslint-disable-next-line @typescript-eslint/ban-types
    SelectProps<object>['options']
  >([]);

  useEffect(() => {
    if (
      !userContext.user.isProjectCoachee &&
      !userContext.user.isProjectCoach
    ) {
      return;
    }
    setLoading(true);
    api
      .getJufoExperts()
      .then((result) => {
        setExperts(result);
        setOptions(
          experts.map((item) => ({
            value: item.id,
            label: <JufoExpertDetailCard expert={item} />,
          }))
        );
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userContext.user]);

  if (!userContext.user.isProjectCoachee) {
    return null;
  }

  if (!location.pathname.includes('project-coaching')) {
    return null;
  }

  const searchResult = (query: string) => {
    const searchString = query.toLowerCase();
    return experts
      .filter(
        (e) =>
          e.description.toLowerCase().includes(searchString) ||
          e.expertiseTags.some((t) => t.toLowerCase().includes(searchString)) ||
          e.projectFields.some((p) => p.toLowerCase().includes(searchString)) ||
          e.firstName.toLowerCase().includes(searchString) ||
          e.lastName.toLowerCase().includes(searchString)
      )
      .map((item) => ({
        value: item.id,
        label: <JufoExpertDetailCard expert={item} />,
      }));
  };

  const handleSearch = (value: string) => {
    if (value.trim().length === 0) {
      setOptions(
        experts.map((item) => ({
          value: item.id,
          label: <JufoExpertDetailCard expert={item} />,
        }))
      );
      return;
    }
    setOptions(value ? searchResult(value) : []);
  };

  const onSelect = (value: string) => {
    console.log('onSelect', value);
  };

  return (
    <div className={classes.input}>
      <AutoComplete
        style={{ width: '100%', maxWidth: '500px' }}
        dropdownMatchSelectWidth={340}
        onSearch={handleSearch}
        onSelect={onSelect}
        options={options}
      >
        <Input.Search
          placeholder="Hier nach Experten für dein Thema suchen.."
          enterButton
          loading={loading}
          allowClear
        />
      </AutoComplete>
    </div>
  );
};
