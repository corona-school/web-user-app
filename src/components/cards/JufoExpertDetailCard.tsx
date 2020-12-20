import React, { useContext, useEffect, useState } from 'react';
import Icons from '../../assets/icons';
import { ModalContext } from '../../context/ModalContext';
import { UserContext } from '../../context/UserContext';
import { Expert } from '../../types/Expert';
import Button from '../button';

import { Tag } from '../Tag';
import { Text, Title } from '../Typography';

import classes from './JufoExpertDetailCard.module.scss';

interface Props {
  expert: Expert;
  type?: 'search' | 'card';
  onUnpin?: (id: string) => void;
}

export const JufoExpertDetailCard: React.FC<Props> = (props) => {
  const { user } = useContext(UserContext);
  const modalContext = useContext(ModalContext);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    try {
      const stringExperts = window.localStorage.getItem('experts');
      if (!stringExperts) {
        setPinned(false);
        return;
      }
      const experts = JSON.parse(stringExperts);
      if (experts instanceof Array && experts.includes(props.expert.id)) {
        setPinned(true);
      }

      // eslint-disable-next-line no-empty
    } catch (err) {}
  }, []);

  const pinExpert = () => {
    const stringExperts = window.localStorage.getItem('experts');
    if (!stringExperts) {
      window.localStorage.setItem('experts', JSON.stringify([props.expert.id]));
    }
    try {
      const experts = JSON.parse(stringExperts);
      if (experts instanceof Array && !experts.includes(props.expert.id)) {
        experts.push(props.expert.id);
        window.localStorage.setItem('experts', JSON.stringify(experts));
        setPinned(true);
      }

      // eslint-disable-next-line no-empty
    } catch (err) {}
  };

  const unpinExpert = () => {
    const stringExperts = window.localStorage.getItem('experts');
    if (!stringExperts) {
      return;
    }
    try {
      const experts = JSON.parse(stringExperts);
      if (experts instanceof Array && experts.includes(props.expert.id)) {
        window.localStorage.setItem(
          'experts',
          JSON.stringify(experts.filter((e) => e !== props.expert.id))
        );
        setPinned(false);
        props.onUnpin(props.expert.id);
      }

      // eslint-disable-next-line no-empty
    } catch (err) {}
  };

  const openEmailDialog = () => {
    modalContext.setOpenedModal(props.expert.id);
  };

  return (
    <div className={classes.container}>
      <div className={classes.infoContainer}>
        <div className={classes.header}>
          <Title size="h4" bold>
            {props.expert.firstName} {props.expert.lastName}
          </Title>

          <div className={classes.rightHeader}>
            {props.expert.projectFields.map((field) => (
              <Tag
                key={`${field}-${props.expert.id}`}
                fontSize="12px"
                background="#F4F6FF"
                color="#4E6AE6"
              >
                {field}
              </Tag>
            ))}
            {user.isProjectCoachee && (
              <Button
                backgroundColor="#4E6AE6"
                color="#ffffff"
                className={classes.emailButton}
                image={
                  pinned ? (
                    <Icons.BookmarkSlashFilled />
                  ) : (
                    <Icons.BookmarkFilled />
                  )
                }
                onClick={pinned ? unpinExpert : pinExpert}
              />
            )}
            <Button
              backgroundColor="#4E6AE6"
              color="#ffffff"
              image={<Icons.EmailFilled />}
              onClick={openEmailDialog}
              className={classes.emailButton}
            />
          </div>
        </div>

        <Text className={props.type === 'card' ? classes.cardDescription : ''}>
          {props.expert.description}
        </Text>

        {props.type === 'card' ? null : (
          <div className={classes.expertTags}>
            {props.expert.expertiseTags.map((tag) => (
              <Tag background="#4E555C" color="#ffffff">
                {tag}
              </Tag>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
