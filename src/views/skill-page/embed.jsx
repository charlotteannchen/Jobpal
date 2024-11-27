import React from 'react';

const extractYouTubeVideoId = (url) => {
  if (typeof url !== 'string') return null; // 確保 URL 是字符串
  const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|embed|shorts|watch)|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null; // 若找到，返回 video ID；若未找到，返回 null
};

const YouTubeEmbed = ({ videoId }) => {
  return (
    <div style={{ width: '100%', height: '0', paddingBottom: '56.25%', position: 'relative' }}>
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      ></iframe>
    </div>
  );
};

const WebEmbed = ({ url }) => {
  return (
    <div style={{ width: '100%', height: '500px', border: '1px solid #ccc' }}>
      <iframe
        src={url}
        title="Embedded Page"
        style={{ width: '100%', height: '100%', border: 'none' }}
      />
    </div>
  );
};

export { extractYouTubeVideoId, YouTubeEmbed, WebEmbed };
