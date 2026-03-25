import Head from 'next/head';
import { FC } from 'react';

/* ─────────────────────────────────────────────────────────────
   Prop Groups
───────────────────────────────────────────────────────────── */

export type BasicProps = {
  title?: string;
  description?: string;
  keywords?: string;
  url?: string;
  author?: string;
  lang?: string;
  charset?: string;
  viewport?: string;
  generator?: string;
  applicationName?: string;
  category?: string;
  classification?: string;
  rating?: 'general' | 'mature' | 'restricted';
  revisitAfter?: string;
  copyright?: string;
  abstract?: string;
  formatDetection?: string;
};

export type RobotsProps = {
  noIndex?: boolean;
  noFollow?: boolean;
};

export type CanonicalProps = {
  canonical?: string;
  ampUrl?: string;
  prev?: string;
  next?: string;
  alternates?: { hreflang: string; href: string }[];
};

export type OgImageProps = {
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  type?: string;
};

export type OgProps = {
  type?:
    | 'website'
    | 'article'
    | 'profile'
    | 'book'
    | 'music.song'
    | 'video.movie';
  siteName?: string;
  locale?: string;
  alternateLocales?: string[];
  image?: OgImageProps;
};

export type ArticleProps = {
  publishedTime?: string;
  modifiedTime?: string;
  expirationTime?: string;
  authors?: string[];
  section?: string;
  tags?: string[];
};

export type ProfileProps = {
  firstName?: string;
  lastName?: string;
  username?: string;
};

export type TwitterProps = {
  card?: 'summary' | 'summary_large_image' | 'app' | 'player';
  site?: string;
  creator?: string;
  title?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
};

export type FaviconProps = {
  ico?: string;
  png16?: string;
  png32?: string;
  png192?: string;
  png512?: string;
};

export type AppleProps = {
  touchIcon?: string;
  touchIconPrecomposed?: string;
  webAppCapable?: boolean;
  webAppTitle?: string;
  webAppStatusBar?: 'default' | 'black' | 'black-translucent';
};

export type MaskIconProps = {
  href?: string;
  color?: string;
};

export type MsProps = {
  tileImage?: string;
  tileColor?: string;
  tooltip?: string;
  startUrl?: string;
};

export type SafariProps = {
  pinnedTab?: string;
  pinnedTabColor?: string;
};

export type ThemeProps = {
  color?: string;
  colorDark?: string;
  colorScheme?: 'light' | 'dark' | 'light dark' | 'dark light';
  mobileWebAppCapable?: boolean;
};

export type PwaProps = {
  manifest?: string;
};

export type FeedProps = {
  rss?: { url: string; title?: string };
  atom?: { url: string; title?: string };
};

export type VerificationProps = {
  google?: string;
  bing?: string;
  yandex?: string;
  pinterest?: string;
};

export type GeoProps = {
  region?: string;
  placename?: string;
  position?: string;
  icbm?: string;
};

export type PerformanceProps = {
  preconnect?: string[];
  dnsPrefetch?: string[];
  preload?: {
    href: string;
    as: string;
    type?: string;
    crossOrigin?: 'anonymous' | 'use-credentials' | '';
  }[];
  prefetch?: string[];
};

export type JsonLdProps = Record<string, unknown> | Record<string, unknown>[];

export type CustomProps = {
  meta?: {
    name?: string;
    property?: string;
    content: string;
    httpEquiv?: string;
  }[];
  links?: { rel: string; href: string; [key: string]: string }[];
};

/* ─────────────────────────────────────────────────────────────
   Root Props
───────────────────────────────────────────────────────────── */

export type HeadTemplateProps = {
  basic?: BasicProps;
  robots?: RobotsProps;
  canonical?: CanonicalProps;
  og?: OgProps;
  article?: ArticleProps;
  profile?: ProfileProps;
  twitter?: TwitterProps;
  favicon?: FaviconProps;
  apple?: AppleProps;
  maskIcon?: MaskIconProps;
  ms?: MsProps;
  safari?: SafariProps;
  theme?: ThemeProps;
  pwa?: PwaProps;
  feed?: FeedProps;
  verification?: VerificationProps;
  geo?: GeoProps;
  performance?: PerformanceProps;
  jsonLd?: JsonLdProps;
  custom?: CustomProps;
};

/* ─────────────────────────────────────────────────────────────
   Component
───────────────────────────────────────────────────────────── */

export const HeadTemplate: FC<HeadTemplateProps> = ({
  basic = {},
  robots = {},
  canonical: canonicalProps = {},
  og = {},
  article,
  profile,
  twitter = {},
  favicon = {},
  apple = {},
  maskIcon,
  ms = {},
  safari = {},
  theme = {},
  pwa = {},
  feed = {},
  verification = {},
  geo = {},
  performance = {},
  jsonLd,
  custom = {},
}) => {
  const {
    title = '',
    description = '',
    keywords,
    url = '',
    author,
    lang = 'en',
    charset = 'utf-8',
    viewport = 'width=device-width, initial-scale=1',
    generator,
    applicationName,
    category,
    classification,
    rating,
    revisitAfter,
    copyright,
    abstract,
    formatDetection = 'telephone=no',
  } = basic;

  const { noIndex = false, noFollow = false } = robots;
  const robotsContent = `${noIndex ? 'noindex' : 'index'},${noFollow ? 'nofollow' : 'follow'}`;

  const { canonical, ampUrl, prev, next, alternates } = canonicalProps;
  const resolvedCanonical = canonical ?? url;

  const {
    type: ogType = 'website',
    siteName,
    locale = 'en_US',
    alternateLocales,
    image: ogImage,
  } = og;

  const {
    card: twitterCard = 'summary_large_image',
    site: twitterSite,
    creator: twitterCreator,
    title: twitterTitle,
    description: twitterDescription,
    image: twitterImage,
    imageAlt: twitterImageAlt,
  } = twitter;

  const {
    ico: favicon_ico = '/favicon.ico',
    png16,
    png32,
    png192,
    png512,
  } = favicon;

  const {
    touchIcon = '/apple-touch-icon.png',
    touchIconPrecomposed,
    webAppCapable = false,
    webAppTitle,
    webAppStatusBar = 'default',
  } = apple;

  const { tileImage, tileColor, tooltip: msTooltip, startUrl: msStartUrl } = ms;

  const { pinnedTab, pinnedTabColor } = safari;

  const {
    color: themeColor = '#000000',
    colorDark: themeColorDark,
    colorScheme,
    mobileWebAppCapable = false,
  } = theme;

  const { manifest = '/manifest.json' } = pwa;

  const { rss, atom } = feed;

  const {
    preconnect = ['https://fonts.googleapis.com'],
    dnsPrefetch = ['https://fonts.googleapis.com'],
    preload,
    prefetch,
  } = performance;

  return (
    <Head>
      {/* ─── Charset & Viewport ─────────────────────────────── */}
      <meta charSet={charset} />
      <meta name="viewport" content={viewport} />

      {/* ─── Basic ──────────────────────────────────────────── */}
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      {author && <meta name="author" content={author} />}
      <meta httpEquiv="content-language" content={lang} />
      <meta name="robots" content={robotsContent} />
      {generator && <meta name="generator" content={generator} />}
      {applicationName && (
        <meta name="application-name" content={applicationName} />
      )}
      {category && <meta name="category" content={category} />}
      {classification && (
        <meta name="classification" content={classification} />
      )}
      {rating && <meta name="rating" content={rating} />}
      {revisitAfter && <meta name="revisit-after" content={revisitAfter} />}
      {copyright && <meta name="copyright" content={copyright} />}
      {abstract && <meta name="abstract" content={abstract} />}
      {formatDetection && (
        <meta name="format-detection" content={formatDetection} />
      )}

      {/* ─── Canonical & Pagination ──────────────────────────── */}
      {resolvedCanonical && <link rel="canonical" href={resolvedCanonical} />}
      {ampUrl && <link rel="amphtml" href={ampUrl} />}
      {prev && <link rel="prev" href={prev} />}
      {next && <link rel="next" href={next} />}
      {alternates?.map(({ hreflang, href }) => (
        <link key={hreflang} rel="alternate" hrefLang={hreflang} href={href} />
      ))}

      {/* ─── Open Graph ─────────────────────────────────────── */}
      {title && <meta property="og:title" content={title} />}
      {description && <meta property="og:description" content={description} />}
      <meta property="og:type" content={ogType} />
      {url && <meta property="og:url" content={url} />}
      {siteName && <meta property="og:site_name" content={siteName} />}
      <meta property="og:locale" content={locale} />
      {alternateLocales?.map((loc) => (
        <meta key={loc} property="og:locale:alternate" content={loc} />
      ))}

      {/* ─── OG Image ────────────────────────────────────────── */}
      {ogImage?.src && <meta property="og:image" content={ogImage.src} />}
      {ogImage?.src && ogImage.alt && (
        <meta property="og:image:alt" content={ogImage.alt} />
      )}
      {ogImage?.src && ogImage.width && (
        <meta property="og:image:width" content={String(ogImage.width)} />
      )}
      {ogImage?.src && ogImage.height && (
        <meta property="og:image:height" content={String(ogImage.height)} />
      )}
      {ogImage?.src && ogImage.type && (
        <meta property="og:image:type" content={ogImage.type} />
      )}

      {/* ─── Article ─────────────────────────────────────────── */}
      {ogType === 'article' && article?.publishedTime && (
        <meta
          property="article:published_time"
          content={article.publishedTime}
        />
      )}
      {ogType === 'article' && article?.modifiedTime && (
        <meta property="article:modified_time" content={article.modifiedTime} />
      )}
      {ogType === 'article' && article?.expirationTime && (
        <meta
          property="article:expiration_time"
          content={article.expirationTime}
        />
      )}
      {ogType === 'article' && article?.section && (
        <meta property="article:section" content={article.section} />
      )}
      {ogType === 'article' &&
        article?.authors?.map((a) => (
          <meta key={a} property="article:author" content={a} />
        ))}
      {ogType === 'article' &&
        article?.tags?.map((tag) => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}

      {/* ─── Profile ─────────────────────────────────────────── */}
      {ogType === 'profile' && profile?.firstName && (
        <meta property="profile:first_name" content={profile.firstName} />
      )}
      {ogType === 'profile' && profile?.lastName && (
        <meta property="profile:last_name" content={profile.lastName} />
      )}
      {ogType === 'profile' && profile?.username && (
        <meta property="profile:username" content={profile.username} />
      )}

      {/* ─── Twitter ─────────────────────────────────────────── */}
      <meta name="twitter:card" content={twitterCard} />
      {(twitterTitle ?? title) && (
        <meta name="twitter:title" content={twitterTitle ?? title} />
      )}
      {(twitterDescription ?? description) && (
        <meta
          name="twitter:description"
          content={twitterDescription ?? description}
        />
      )}
      {(twitterImage ?? ogImage?.src) && (
        <meta name="twitter:image" content={twitterImage ?? ogImage?.src} />
      )}
      {(twitterImageAlt ?? ogImage?.alt) && (
        <meta
          name="twitter:image:alt"
          content={twitterImageAlt ?? ogImage?.alt}
        />
      )}
      {twitterSite && <meta name="twitter:site" content={twitterSite} />}
      {twitterCreator && (
        <meta name="twitter:creator" content={twitterCreator} />
      )}

      {/* ─── Favicon ─────────────────────────────────────────── */}
      {favicon_ico && <link rel="icon" href={favicon_ico} />}
      {png32 && <link rel="icon" type="image/png" sizes="32x32" href={png32} />}
      {png16 && <link rel="icon" type="image/png" sizes="16x16" href={png16} />}
      {png192 && (
        <link rel="icon" type="image/png" sizes="192x192" href={png192} />
      )}
      {png512 && (
        <link rel="icon" type="image/png" sizes="512x512" href={png512} />
      )}

      {/* ─── Apple ───────────────────────────────────────────── */}
      {touchIcon && <link rel="apple-touch-icon" href={touchIcon} />}
      {touchIconPrecomposed && (
        <link rel="apple-touch-icon-precomposed" href={touchIconPrecomposed} />
      )}
      {webAppCapable && (
        <meta name="apple-mobile-web-app-capable" content="yes" />
      )}
      {webAppCapable && (
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content={webAppStatusBar}
        />
      )}
      {webAppTitle && (
        <meta name="apple-mobile-web-app-title" content={webAppTitle} />
      )}

      {/* ─── Mask Icon ───────────────────────────────────────── */}
      {maskIcon?.href && (
        <link
          rel="mask-icon"
          href={maskIcon.href}
          {...(maskIcon.color ? { color: maskIcon.color } : {})}
        />
      )}

      {/* ─── MS (Windows / Edge) ─────────────────────────────── */}
      {tileImage && <meta name="msapplication-TileImage" content={tileImage} />}
      {tileColor && <meta name="msapplication-TileColor" content={tileColor} />}
      {msTooltip && <meta name="msapplication-tooltip" content={msTooltip} />}
      {msStartUrl && (
        <meta name="msapplication-starturl" content={msStartUrl} />
      )}

      {/* ─── Safari ──────────────────────────────────────────── */}
      {pinnedTab && (
        <link
          rel="mask-icon"
          href={pinnedTab}
          {...(pinnedTabColor ? { color: pinnedTabColor } : {})}
        />
      )}

      {/* ─── Theme ───────────────────────────────────────────── */}
      <meta name="theme-color" content={themeColor} />
      {themeColorDark && (
        <meta
          name="theme-color"
          media="(prefers-color-scheme: dark)"
          content={themeColorDark}
        />
      )}
      {colorScheme && <meta name="color-scheme" content={colorScheme} />}
      {mobileWebAppCapable && (
        <meta name="mobile-web-app-capable" content="yes" />
      )}

      {/* ─── PWA ─────────────────────────────────────────────── */}
      {manifest && <link rel="manifest" href={manifest} />}

      {/* ─── Feed ────────────────────────────────────────────── */}
      {rss?.url && (
        <link
          rel="alternate"
          type="application/rss+xml"
          title={rss.title ?? 'RSS Feed'}
          href={rss.url}
        />
      )}
      {atom?.url && (
        <link
          rel="alternate"
          type="application/atom+xml"
          title={atom.title ?? 'Atom Feed'}
          href={atom.url}
        />
      )}

      {/* ─── Verification ────────────────────────────────────── */}
      {verification.google && (
        <meta name="google-site-verification" content={verification.google} />
      )}
      {verification.bing && (
        <meta name="msvalidate.01" content={verification.bing} />
      )}
      {verification.yandex && (
        <meta name="yandex-verification" content={verification.yandex} />
      )}
      {verification.pinterest && (
        <meta name="p:domain_verify" content={verification.pinterest} />
      )}

      {/* ─── Geo ─────────────────────────────────────────────── */}
      {geo.region && <meta name="geo.region" content={geo.region} />}
      {geo.placename && <meta name="geo.placename" content={geo.placename} />}
      {geo.position && <meta name="geo.position" content={geo.position} />}
      {geo.icbm && <meta name="ICBM" content={geo.icbm} />}

      {/* ─── Performance ─────────────────────────────────────── */}
      {preconnect.map((href) => (
        <link key={href} rel="preconnect" href={href} />
      ))}
      {dnsPrefetch.map((href) => (
        <link key={href} rel="dns-prefetch" href={href} />
      ))}
      {preload?.map(({ href, as, type: t, crossOrigin }) => (
        <link
          key={href}
          rel="preload"
          href={href}
          as={as}
          {...(t ? { type: t } : {})}
          {...(crossOrigin ? { crossOrigin } : {})}
        />
      ))}
      {prefetch?.map((href) => (
        <link key={href} rel="prefetch" href={href} />
      ))}

      {/* ─── Structured Data (JSON-LD) ───────────────────────── */}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />
      )}

      {/* ─── Custom / Escape Hatch ───────────────────────────── */}
      {custom.meta?.map(({ name, property, content, httpEquiv }, i) => (
        <meta
          key={i}
          {...(name ? { name } : {})}
          {...(property ? { property } : {})}
          {...(httpEquiv ? { httpEquiv } : {})}
          content={content}
        />
      ))}
      {custom.links?.map(({ rel, href, ...rest }, i) => (
        <link key={i} rel={rel} href={href} {...rest} />
      ))}
    </Head>
  );
};
