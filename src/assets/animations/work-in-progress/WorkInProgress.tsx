import React from 'react';
import Lottie from 'react-lottie';
import animationData from './animation.json';

export const WorkInProgress = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <div>
      <Lottie options={defaultOptions} height={400} width={400} />
    </div>
  );
};
