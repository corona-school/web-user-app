import React, { useEffect, useRef, useState } from 'react';
import styles from './TagInput.module.scss';
import { ReactComponent as Cross } from '../../assets/icons/cancel-symbol.svg';
import { hexToRGB } from '../../utils/DashboardUtils';

function useOutsideAlerter(ref, onOutsideClick) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        onOutsideClick();
      }
    }
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onOutsideClick, ref]);
}

export default function TagInput({
  availableTags,
  title,
  onChange,
  value,
  accentColor,
}) {
  const [tags, setTags] = useState(value);
  const [isFocused, setFocused] = useState(false);
  const [currentTBcontent, setCurrentTBcontent] = useState('');
  const textboxRef = useRef(null);
  const wrapperRef = useRef(null);

  const addTag = (tag) => {
    if (tag.length > 0 && !tags.some((t) => t.trim() === tag)) {
      setTags((current) => [...current, tag]);
    }
  };

  useOutsideAlerter(wrapperRef, () => {
    setFocused(false);
    if (currentTBcontent.trim().length > 0) {
      // Finalize last tag
      addTag(currentTBcontent.trim());
      setCurrentTBcontent('');
    }
  });

  const deleteTag = (tag) => {
    setTags((current) => current.filter((x) => x !== tag));
  };

  useEffect(() => {
    if (currentTBcontent.includes(',')) {
      addTag(currentTBcontent.replace(',', '').trim());
      setCurrentTBcontent('');
    }
  }, [currentTBcontent]);

  useEffect(() => {
    onChange(tags);
  }, [tags]);

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions,jsx-a11y/click-events-have-key-events
    <div
      className={styles.outerWrapper}
      ref={wrapperRef}
      onClick={() => {
        if (textboxRef.current != null) {
          textboxRef.current.focus();
        }
      }}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className={styles.label}>{title}</label>

      <div className={styles.wrapper}>
        {tags.map((tag) => (
          <div
            key={tag}
            className={styles.tag}
            style={{
              backgroundColor: hexToRGB(accentColor, 0.18),
              color: accentColor,
            }}
          >
            <span className={styles.tagInner} key={tag}>
              {tag}
            </span>
            <button onClick={() => deleteTag(tag)}>
              <Cross
                className={styles.deleteTag}
                style={{ fill: accentColor }}
              />
            </button>
          </div>
        ))}
        <input
          type="text"
          ref={textboxRef}
          className={styles.textbox}
          placeholder="Tags eingeben, mit Komma trennen"
          onChange={(e) => setCurrentTBcontent(e.target.value)}
          value={currentTBcontent}
          onFocus={() => setFocused(true)}
        />
      </div>
      {isFocused &&
        availableTags.filter(
          (tag) =>
            !tags.includes(tag) &&
            (currentTBcontent.length > 0
              ? tag.toLowerCase().includes(currentTBcontent.toLowerCase())
              : true)
        ).length > 0 && (
          <ul className={styles.tagsDropdown}>
            {availableTags
              .filter(
                (tag) =>
                  !tags.includes(tag) &&
                  (currentTBcontent.length > 0
                    ? tag.toLowerCase().includes(currentTBcontent.toLowerCase())
                    : true)
              )
              .map((tag) => (
                <li
                  key={tag}
                  style={{
                    backgroundColor: hexToRGB(accentColor, 0.18),
                    color: accentColor,
                  }}
                  className={styles.tagsDropdownItem}
                >
                  <button
                    key={`${tag}b`}
                    onClick={() => {
                      addTag(tag);
                      setCurrentTBcontent('');
                    }}
                  >
                    {tag}
                  </button>
                </li>
              ))}
          </ul>
        )}
    </div>
  );
}
