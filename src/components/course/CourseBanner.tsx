import React from 'react';
import Images from '../../assets/images';
import classes from './CourseBanner.module.scss';
import { Title, Text } from '../Typography';
import AccentColorLinkButton from '../button/AccentColorLinkButton';
import { ReactComponent as MagnifyingGlass } from '../../assets/icons/search-solid.svg';

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
            <Title size="h2" bold className={classes.title}>
              Unser Angebot
            </Title>
            {revisionsOnly && (
              <Text large>
                {targetGroup === 'participants'
                  ? 'Schau gerne durch unser Angebot und melde dich für eine Hausaufgabenbetreuung oder ein Repetitorium an!'
                  : 'Hier kannst du dir alle Gruppen-Lernunterstützungen auf unserer Plattform anschauen und auch deine zugelassenen Angebote findest du dort wieder.'}
              </Text>
            )}
            {!revisionsOnly && (
              <Text large>
                {targetGroup === 'participants'
                  ? 'Schau gerne durch unser Angebot neuer und spannender Kurse und melde dich zu unseren Gruppenkursen an!'
                  : 'Hier kannst du dir alle Kurse auf unserer Plattform anschauen und auch deine zugelassenen Kurse findest du dort wieder.'}
              </Text>
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
                : 'Projektwoche entdecken'
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
