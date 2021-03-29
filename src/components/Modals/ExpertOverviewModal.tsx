import React, { useContext, useEffect, useState, useRef } from 'react';
import StyledReactModal from 'styled-react-modal';
import { ClipLoader } from 'react-spinners';
import { Input, AutoComplete, Empty, Tag } from 'antd';
import { SelectProps } from 'antd/es/select';
import { Title } from '../Typography';
import { ModalContext } from '../../context/ModalContext';
import { ApiContext } from '../../context/ApiContext';
import classes from './ExpertOverviewModal.module.scss';
import { Expert } from '../../types/Expert';
import { JufoExpertDetailCard } from '../cards/JufoExpertDetailCard';
import { UserContext } from '../../context/UserContext';

export const MODAL_IDENTIFIER = 'expertOverviewModal';
const MODAL_TITLE = 'Liste von Expert*innen';

interface SearchOption {
  [index: number]: { value: string; label: JSX.Element };
}

export const ExpertOverviewModal: React.FC = () => {
  const userContext = useContext(UserContext);
  const modalContext = useContext(ModalContext);
  const api = useContext(ApiContext);
  const [options, setOptions] = useState<SelectProps<SearchOption>['options']>(
    []
  );
  const inputSearchRef = useRef(null);

  const [experts, setExperts] = useState<Expert[]>([]);
  const [filteredExperts, setFileredExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (
      !userContext.user.isProjectCoachee &&
      !userContext.user.isProjectCoach
    ) {
      return;
    }
    if (modalContext.openedModal === MODAL_IDENTIFIER) {
      setLoading(true);
      api
        .getJufoExperts()
        .then((result) => {
          setExperts(result);
          setFileredExperts(result);
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [modalContext.openedModal, userContext.user]);

  const onSearch = (value: string) => {
    const searchString = value.toLowerCase();
    const filter = experts.filter(
      (e) =>
        e.description.toLowerCase().includes(searchString) ||
        e.expertiseTags.some((t) => t.toLowerCase().includes(searchString)) ||
        e.projectFields.some((p) => p.toLowerCase().includes(searchString)) ||
        e.firstName.toLowerCase().includes(searchString) ||
        e.lastName.toLowerCase().includes(searchString)
    );
    return filter;
  };

  const searchSuggestions = (query: string) =>
    onSearch(query).map((_) => {
      const val = `${_.id}`;
      return {
        value: val,
        label: (
          <div style={{ paddingBottom: '1rem' }}>
            <div>
              <b>{`${_.firstName} ${_.lastName}`}</b>
            </div>
            <div>
              {_.expertiseTags.map((tag, i) => (
                <Tag
                  // eslint-disable-next-line react/no-array-index-key
                  key={`${_.id}-${i}`}
                  style={{ background: '#4E555C', fontSize: '12px' }}
                  color="#ffffff"
                >
                  {tag}
                </Tag>
              ))}
            </div>
            <div>{_.description}</div>
          </div>
        ),
      };
    });

  const handleSearch = (value: string) =>
    setOptions(value ? searchSuggestions(value) : []);

  const handleSelect = (value: string) => {
    if (value.trim().length === 0) {
      setFileredExperts(experts);
      return;
    }
    setFileredExperts(onSearch(value));
  };

  if (!userContext.user.isProjectCoachee && !userContext.user.isProjectCoach) {
    return null;
  }

  if (loading) {
    return (
      <StyledReactModal isOpen={modalContext.openedModal === MODAL_IDENTIFIER}>
        <div className={classes.modal}>
          <Title size="h2">Wir aktualisieren deine Informationen...</Title>
          <ClipLoader size={100} color="#4E6AE6" loading />
        </div>
      </StyledReactModal>
    );
  }

  return (
    <StyledReactModal
      isOpen={modalContext.openedModal === MODAL_IDENTIFIER}
      onBackgroundClick={() => modalContext.setOpenedModal(null)}
    >
      <div className={classes.modal}>
        <Title size="h2">{MODAL_TITLE}</Title>

        <AutoComplete
          dropdownMatchSelectWidth={252}
          className={classes.AutoComplete}
          style={{ width: '100%', marginBottom: '2rem' }}
          options={options}
          onSelect={handleSelect}
          onSearch={handleSearch}
          onChange={(e) => e.trim().length === 0 && setFileredExperts(experts)}
        >
          <Input.Search
            size="large"
            placeholder="Suche nach Expert*innen für.."
            ref={inputSearchRef}
            enterButton
            onPressEnter={() =>
              handleSelect(inputSearchRef.current.props.value)
            }
          />
        </AutoComplete>

        {filteredExperts.length !== 0 ? (
          filteredExperts.map((expert) => (
            <JufoExpertDetailCard key={expert.id} expert={expert} />
          ))
        ) : (
          <Empty
            description="
          keine Ergebnisse gefunden"
            style={{ padding: '2rem' }}
          />
        )}
      </div>
    </StyledReactModal>
  );
};
