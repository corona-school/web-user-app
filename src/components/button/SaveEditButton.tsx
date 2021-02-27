import React from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import AccentColorButton from './AccentColorButton';
import styles from './SaveEditButton.module.scss';

interface Props {
  isLoading?: boolean;
  isEditing: boolean;
  onEditChange?: (newIsEditing: boolean) => void;
}

const Loader = () => {
  return (
    <div className={styles.LoaderWrapper}>
      <ClipLoader size={15} loading />
    </div>
  );
};

const SaveEditButton: React.FC<Props> = ({
  isLoading = false,
  isEditing,
  onEditChange,
}) => {
  const buttonTitle = isEditing ? 'Speichern' : 'Bearbeiten';

  return (
    <AccentColorButton
      accentColor="#fa3d7f"
      disabled={isLoading}
      onClick={() => {
        onEditChange(!isEditing);
      }}
      label={buttonTitle}
      Icon={isLoading ? Loader : null}
      small
    />
  );
};

export default SaveEditButton;
