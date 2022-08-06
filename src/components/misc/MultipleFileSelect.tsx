import React, { useEffect, useRef, useState } from 'react';
import styles from './MultipleFileSelect.module.scss';
import AccentColorButton from '../button/AccentColorButton';
import { ReactComponent as Cross } from '../../assets/icons/cancel-symbol.svg';
import { ReactComponent as Pencil } from '../../assets/icons/pen-solid.svg';
import { ReactComponent as Checkmark } from '../../assets/icons/check-solid.svg';
import { friendlyFileSize } from '../../utils/DashboardUtils';

// create extension of built-in File class to include an ID, which is important for handling the files in react (e.g. for keys)
class MetaFile extends File {
  id: number;

  constructor(data, name, options, id) {
    super(data, name, options);
    this.id = id;
  }
}

const renameFile = (file, extension, newName) => {
  return new MetaFile(
    [file],
    newName + extension,
    { type: file.type },
    file.id
  );
};

const cleanFilename = (file) => {
  const filename = file.name.replace(/\.[^/.]+$/, '');
  const extension = file.name.match(/\.[^/.]+$/);
  return renameFile(
    file,
    extension,
    filename
      .replaceAll('.', '_')
      .replaceAll(' ', '_')
      .replaceAll('/', '_')
      .replaceAll('\\', '_')
  );
};

interface FileContainerProps {
  file: MetaFile;
  setFile: (file: MetaFile) => void;
  onRemoveClick: () => void;
}

const FileContainer: React.FC<FileContainerProps> = ({
  file,
  setFile,
  onRemoveClick,
}) => {
  const [editing, setEditing] = useState(false);
  const [fileName, setFileName] = useState(file.name.replace(/\.[^/.]+$/, ''));

  const extension = file.name.match(/\.[^/.]+$/);

  useEffect(() => {
    setFileName(file.name.replace(/\.[^/.]+$/, ''));
  }, [file.name]);

  return (
    <div className={styles.fileContainerWrapper}>
      <div className={styles.fileInfo}>
        {editing ? (
          <div>
            <input
              type="text"
              value={fileName}
              className={styles.textBox}
              onChange={(e) => setFileName(e.target.value)}
            />
            <span>{extension}</span>
          </div>
        ) : (
          <span className={styles.fileName}>{fileName + extension}</span>
        )}
        <button
          className={styles.editFile}
          onClick={() => {
            if (editing) {
              const renamed = renameFile(file, extension, fileName);
              setFile(renamed);
            }
            setEditing(!editing);
          }}
        >
          {editing ? <Checkmark /> : <Pencil />}
        </button>
      </div>
      <span className={styles.fileSize}>
        {friendlyFileSize(file.size, true)}
      </span>
      <button className={styles.removeFile} onClick={onRemoveClick}>
        <Cross />
      </button>
    </div>
  );
};

interface MultipleFileProps {
  selectedFiles: MetaFile[];
  setSelectedFiles: (selectedFiles: MetaFile[]) => void;
}
export const MultipleFileSelect: React.FC<MultipleFileProps> = ({
  selectedFiles,
  setSelectedFiles,
}) => {
  const fileInput = useRef(null);

  const getTotalSize = () => {
    let size = 0;
    selectedFiles.forEach((f) => {
      size += f.size;
    });
    return size;
  };
  const getHint = () => {
    if (selectedFiles.length === 0) {
      return 'Maximalgröße aller Dateien kombiniert: 15 MB';
    }
    const remaining = 15 * 10 ** 6 - getTotalSize();
    if (remaining >= 0) {
      return `${friendlyFileSize(remaining, true)} verbleibend`;
    }

    return `${friendlyFileSize(-remaining, true)} zu viel!`;
  };
  return (
    <div>
      {selectedFiles.map((file) => {
        return (
          <FileContainer
            file={file}
            setFile={(f) =>
              setSelectedFiles([
                ...selectedFiles.filter((x) => x.id !== f.id),
                cleanFilename(f),
              ])
            }
            key={String(file.id) + file.name}
            onRemoveClick={() =>
              setSelectedFiles(selectedFiles.filter((f) => f.id !== file.id))
            }
          />
        );
      })}
      <div className={styles.buttonBox}>
        <AccentColorButton
          small
          accentColor="#770F36"
          onClick={() => fileInput.current.click()}
          label="Datei auswählen"
        />
        <span>{getHint()}</span>
      </div>

      <input
        type="file"
        multiple
        ref={fileInput}
        className={styles.fileInput}
        onChange={(e) => {
          const files = [...e.target.files].map((f) => {
            return Object.assign(cleanFilename(f), {
              id: Math.random().toString(36).substring(2), // generate random string by converting a random number to a string using the radix 36 and chopping off "0." in front through .substring(2).
            }); // avoid strange key-related behavior when selecting the same file twice (can't remove it)
          });
          setSelectedFiles([...selectedFiles, ...files]);
        }}
      />
    </div>
  );
};
