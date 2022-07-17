import React from 'react';
import { useAPIResult } from '../context/ApiContext';
import { Spinner } from '../components/loading/Spinner';
import Images from '../assets/images';
import { Title } from '../components/Typography';

const RemissionRequest: React.FC = () => {
  const [remissionRequest] = useAPIResult('getRemissionRequest');

  if (remissionRequest.value) {
    window.location.href = URL.createObjectURL(
      new Blob([remissionRequest.value], { type: 'application/pdf' })
    );
  }

  if (remissionRequest.error) {
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
        <Images.NotFound />
        <Title size="h3">Dokument konnte nicht gefunden werden.</Title>
      </div>
    );
  }

  return <Spinner message="Bescheinigung wird geladen." />;
};

export default RemissionRequest;
