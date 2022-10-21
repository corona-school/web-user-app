import React from 'react';
import classes from './CourseBanner.module.scss';
import { Text, Title } from '../Typography';

export const GroupSupportBanner: React.FC = () => {
  return (
    <div className={classes.courseOverviewContainer}>
      <div className={classes.hightightGroupSupportBanner} />
      <div className={classes.couseOverviewContent}>
        <div className={classes.courseOverviewHeader}>
          <div className={classes.textLeft}>
            <Title size="h2" bold className={classes.title}>
              Neu hier?
            </Title>
            <Text large>
              Erfahre in diesem Dokument, wie du unkompliziert Kurse in der
              Gruppen-Nachhilfe anbieten kannst:{' '}
              <a href="https://drive.google.com/file/d/10qwQ6ZzPqyZax6olgB9YlcgX2l1tA208/view">
                Tutorial (PDF)
              </a>
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
};
