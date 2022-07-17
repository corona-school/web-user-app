import React from 'react';
import Images from '../../assets/images';
import classes from './CourseBanner.module.scss';
import { Title, Text } from '../Typography';
import AccentColorLinkButton from '../button/AccentColorLinkButton';
import { ReactComponent as MagnifyingGlass } from '../../assets/icons/search-solid.svg';
import {
  projectWeekPupilText,
  projectWeekStudentText,
  projectWeekTitle,
} from '../../assets/projectWeekBannerAssets';

interface Props {
  showImage?: boolean;
  targetGroup: 'participants' | 'instructors';
  revisionsOnly?: boolean;
}

export const CourseBanner: React.FC<Props> = ({
  showImage,
  targetGroup,
  revisionsOnly = false,
}) => {
  return (
    <div className={classes.courseOverviewContainer}>
      <div className={classes.hightightCourse} />
      <div className={classes.couseOverviewContent}>
        <div className={classes.courseOverviewHeader}>
          <div className={classes.textLeft}>
            {revisionsOnly && (
              <>
                <Title size="h2" bold className={classes.title}>
                  Unser Angebot
                </Title>
                <Text large>
                  {targetGroup === 'participants'
                    ? 'Schau gerne durch unser Angebot und melde dich für eine Hausaufgabenbetreuung oder ein Repetitorium an!'
                    : 'Hier kannst du dir alle Gruppen-Lernunterstützungen auf unserer Plattform anschauen und auch deine zugelassenen Angebote findest du dort wieder.'}
                </Text>
              </>
            )}
            {!revisionsOnly && (
              <>
                <Title size="h2" bold className={classes.title}>
                  {projectWeekTitle}
                </Title>
                <Text large>
                  {targetGroup === 'participants' ? (
                    <>{projectWeekPupilText}</>
                  ) : (
                    <>{projectWeekStudentText}</>
                  )}
                </Text>
              </>
            )}
          </div>
          <AccentColorLinkButton
            link={revisionsOnly ? '/matches/revisions' : '/courses/overview'}
            local
            accentColor="#4E6AE6"
            // className={classes.courseButton}
            label={
              revisionsOnly
                ? 'Gruppen-Lernunterstützung entdecken'
                : 'Fokuswochen entdecken'
            }
            small
            Icon={MagnifyingGlass}
          />
        </div>
        {showImage && <Images.Graduation className={classes.graduationImage} />}
      </div>
    </div>
  );
};
