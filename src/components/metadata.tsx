import { useEffect, useState } from 'react';

import type { Props } from '../types/index';

export default function Metadata({
  title,
  description,
  image = '/opengraph-image.png',
}: Props) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 1024px)');
    setIsMobile(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const currentUrl = typeof window !== 'undefined' ? window.location.origin : '';

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="theme-color" content={isMobile ? '#262626' : '#454545'} />

      {/* Open Graph */}
      <meta property="og:url" content={currentUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:domain" content={currentUrl} />
      <meta property="twitter:url" content={currentUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </>
  );
}
