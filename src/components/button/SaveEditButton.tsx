import React from 'react';
import ClipLoader from 'react-spinners/ClipLoader';

import Button from '.';

import classes from './SaveEditButton.module.scss';

interface Props {
  isLoading?: boolean;
  isEditing: boolean;
  onEditChange?: (newIsEditing: boolean) => void;
}
const SaveEditButton: React.FC<Props> = ({
  isLoading = false,
  isEditing,
  onEditChange,
}) => {
  const buttonTitle = isEditing ? 'Speichern' : 'Bearbeiten';
  const disabled = isLoading;

  return (
    <>
      <Button
        className={classes.main}
        disabled={disabled}
        onClick={() => {
          onEditChange(!isEditing);
        }}
      >
        <div className={classes.loadingIndicator} hidden={!isLoading}>
          <ClipLoader size={15} color="#123abc" loading={isLoading} />
        </div>
        {buttonTitle}
      </Button>
    </>
  );
};

export default SaveEditButton;
