import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description?: string;
  image?: string;
  url?: string;
  exact?: boolean;
}

export function SEO({ title, description, image, url, exact }: SEOProps) {
  const isHome = title.trim().toLowerCase() === 'home';
  const pageTitle = exact
    ? title
    : isHome
      ? 'DevFlow | Personalized Code Learning Platform'
      : `${title} | DevFlow`;

  return (
    <Helmet>
      <title>{pageTitle}</title>
      {description && <meta name="description" content={description} />}
      {image && <meta property="og:image" content={image} />}
      {url && <meta property="og:url" content={url} />}
    </Helmet>
  );
}
