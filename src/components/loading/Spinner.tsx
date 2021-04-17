import React from 'react';
import { ClipLoader } from 'react-spinners';

interface Props {
  message: string;
  color?: string;
}

export const Spinner = (props: Props) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '90vh',
      }}
    >
      <ClipLoader
        size={100}
        color={props.color ? props.color : '#123abc'}
        loading
      />
      <p>{props.message}</p>
    </div>
  );
};
