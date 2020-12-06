import React from 'react';
import Icons from '../../assets/icons';
import { Expert } from '../../types/Expert';
import Button from '../button';
import { Tag } from '../Tag';
import { Text, Title } from '../Typography';

import classes from './JufoExpertDetailCard.module.scss';

interface Props {
  expert: Expert;
}

export const JufoExpertDetailCard: React.FC<Props> = (props) => {
  return (
    <div className={classes.container}>
      <div className={classes.infoContainer}>
        <div className={classes.header}>
          <Title size="h4" bold>
            {props.expert.firstName} {props.expert.lastName}
          </Title>

          <div className={classes.rightHeader}>
            {props.expert.projectFields.map((field) => (
              <Tag fontSize="12px" background="#F4F6FF" color="#4E6AE6">
                {field}
              </Tag>
            ))}
            <Button
              backgroundColor="#4E6AE6"
              color="#ffffff"
              image={<Icons.EmailFilled />}
              className={classes.emailButton}
            />
          </div>
        </div>

        <Text>{props.expert.description}</Text>

        <div className={classes.expertTags}>
          {props.expert.expertiseTags.map((tag) => (
            <Tag background="#4E555C" color="#ffffff">
              {tag}
            </Tag>
          ))}
        </div>
      </div>
    </div>
  );
};
