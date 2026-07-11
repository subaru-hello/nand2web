const ORIGIN = "https://cs.n10u.jp";
const OG_IMAGE = `${ORIGIN}/og.png`;
const AUTHOR = "subaru-hello";
const SITE_NAME = "nand2web";

export interface MakeHeadOpts {
  title: string;
  description: string;
  path: string;
  jsonLd?: object | object[];
  /** Emit a <link rel="canonical">. Off for the root default head so per-route
   * heads own the canonical (TanStack concatenates link arrays; it does not
   * dedupe by rel, so a root canonical would leak onto every page). */
  canonical?: boolean;
}

export function makeHead({
  title,
  description,
  path,
  jsonLd,
  canonical = true,
}: MakeHeadOpts) {
  const url = `${ORIGIN}${path}`;

  const jsonLdMeta: object[] = jsonLd
    ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]).map((ld) => ({
        "script:ld+json": ld,
      }))
    : [];

  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { property: "og:type", content: "website" },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: OG_IMAGE },
      ...jsonLdMeta,
    ],
    links: canonical ? [{ rel: "canonical", href: url }] : [],
  };
}

/** Build a TechArticle + BreadcrumbList JSON-LD pair for a docs page. */
export function makeDocJsonLd({
  title,
  description,
  path,
  breadcrumbLabel,
}: {
  title: string;
  description: string;
  path: string;
  breadcrumbLabel: string;
}) {
  const url = `${ORIGIN}${path}`;
  return [
    {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      headline: title,
      description,
      inLanguage: ["en", "ja"],
      author: { "@type": "Person", name: AUTHOR },
      isPartOf: { "@type": "WebSite", name: SITE_NAME, url: ORIGIN },
      url,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: ORIGIN,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Docs",
          item: `${ORIGIN}/docs`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: breadcrumbLabel,
          item: url,
        },
      ],
    },
  ];
}
