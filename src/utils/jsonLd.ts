const SITE_URL = "https://tutorials.lexingtonthemes.com";
const SITE_NAME = "Lexington Themes Tutorials";
const ORGANIZATION_NAME = "Lexington Themes";
const LOGO_URL = `${SITE_URL}/images/openGraph.png`;

/**
 * Generate Organization JSON-LD
 */
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: ORGANIZATION_NAME,
    url: SITE_URL,
    logo: LOGO_URL,
    sameAs: ["https://twitter.com/LexingtonThemes"],
  };
}

/**
 * Generate WebSite JSON-LD
 */
export function generateWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description:
      "Explore a library of front‑end tutorials built with Astro, Tailwind CSS, Alpine.js, and plain JavaScript.",
    publisher: {
      "@type": "Organization",
      name: ORGANIZATION_NAME,
      logo: {
        "@type": "ImageObject",
        url: LOGO_URL,
      },
    },
  };
}

/**
 * Generate BreadcrumbList JSON-LD
 */
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

/**
 * Generate Article JSON-LD for tutorial pages
 */
export function generateArticleSchema({
  title,
  description,
  url,
  datePublished,
  dateModified,
  author = "Lexington Themes",
  image,
  keywords = [],
}: {
  title: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
  author?: string;
  image?: string;
  keywords?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: title,
    description: description,
    url: url.startsWith("http") ? url : `${SITE_URL}${url}`,
    datePublished: datePublished || new Date().toISOString(),
    dateModified: dateModified || datePublished || new Date().toISOString(),
    author: {
      "@type": "Organization",
      name: author,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: ORGANIZATION_NAME,
      logo: {
        "@type": "ImageObject",
        url: LOGO_URL,
      },
    },
    image: image || LOGO_URL,
    keywords: keywords.join(", "),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url.startsWith("http") ? url : `${SITE_URL}${url}`,
    },
  };
}

/**
 * Generate HowTo JSON-LD for tutorial pages
 */
export function generateHowToSchema({
  name,
  description,
  image,
  totalTime,
  steps,
}: {
  name: string;
  description: string;
  image?: string;
  totalTime?: string; // ISO 8601 duration format (e.g., "PT30M" for 30 minutes)
  steps: Array<{
    name: string;
    text: string;
    url?: string;
    image?: string;
  }>;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: name,
    description: description,
    image: image || LOGO_URL,
    totalTime: totalTime,
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
      url: step.url,
      image: step.image,
    })),
  };
}

/**
 * Generate FAQPage JSON-LD
 */
export function generateFAQSchema(
  questions: Array<{ question: string; answer: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

/**
 * Generate CollectionPage JSON-LD for listing pages
 */
export function generateCollectionPageSchema({
  title,
  description,
  url,
}: {
  title: string;
  description: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    description: description,
    url: url.startsWith("http") ? url : `${SITE_URL}${url}`,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}
