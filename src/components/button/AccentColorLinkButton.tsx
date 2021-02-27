import React from 'react';
import { Link } from 'react-router-dom';
import AccentColorButton from './AccentColorButton';

export default function AccentColorLinkButton(props) {
  const { link, local, ...other } = props;
  if (local != null) {
    return (
      <Link to={props.link || '/'} style={{ textDecoration: 'none' }}>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <AccentColorButton {...other} />
      </Link>
    );
  }
  return (
    <a
      href={props.link || '/'}
      style={{ textDecoration: 'none' }}
      rel="noopener noreferrer"
      target="_blank"
    >
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <AccentColorButton {...other} />
    </a>
  );
}
