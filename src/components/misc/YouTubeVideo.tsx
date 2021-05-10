/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { CSSProperties } from 'react';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: any;
    onPlayerReady: any;
  }
}

interface IVideoProps {
  id: string;
  playOnReady?: boolean;
  className?: string;
  style?: CSSProperties;
}

class YouTubeVideo extends React.Component<IVideoProps> {
  player: any;

  componentDidMount() {
    const tag = document.createElement('script');

    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      this.player = new window.YT.Player(`video-${this.props.id}`, {
        videoId: this.props.id,
        events: {
          onReady: window.onPlayerReady,
        },
      });
    };

    window.onPlayerReady = () => {
      if (this.props.playOnReady) {
        this.player.playVideo();
      }
    };
  }

  componentWillUnmount() {
    this.player.destroy();
  }

  render() {
    return (
      <div
        id={`video-${this.props.id}`}
        className={this.props.className}
        style={this.props.style}
      />
    );
  }
}

export default YouTubeVideo;
