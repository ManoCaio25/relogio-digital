import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../state/useAuthStore';
import VideoPlayer from './VideoPlayer';
import { useVideosStore } from '../../state/useVideosStore';

const VideosPage = () => {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const videos = useVideosStore((state) => state.videos);

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-white">{t('videos.title')}</h1>
      </header>
      <div className="grid gap-6 xl:grid-cols-2">
        {videos.map((video) => (
          <VideoPlayer key={video.id} video={video} userId={user.id} />
        ))}
      </div>
    </section>
  );
};

export default VideosPage;
