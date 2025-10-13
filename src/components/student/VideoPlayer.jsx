import { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import { videoService } from '../../services/video.service.mock';

const VideoPlayer = ({ userId, video }) => {
  const playerRef = useRef(null);
  const [playedSeconds, setPlayedSeconds] = useState(() => videoService.getProgress(userId, video.id));

  useEffect(() => {
    const seconds = videoService.getProgress(userId, video.id);
    setPlayedSeconds(seconds);
  }, [userId, video.id]);

  const handleProgress = (state) => {
    videoService.setProgress(userId, video.id, state.playedSeconds);
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-soft">
      <ReactPlayer
        ref={playerRef}
        url={video.url}
        controls
        width="100%"
        height="280px"
        onProgress={handleProgress}
        onReady={() => {
          if (playerRef.current && playedSeconds) {
            playerRef.current.seekTo(playedSeconds, 'seconds');
          }
        }}
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white">{video.title}</h3>
      </div>
    </div>
  );
};

export default VideoPlayer;
