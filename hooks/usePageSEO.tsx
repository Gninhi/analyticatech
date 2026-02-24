import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * HOOK SEO AVANCÉ
 * Gère le titre, la description, l'Open Graph et le Schema.org (JSON-LD).
 * Optimisé pour le référencement Google et les partages sociaux.
 */

interface SEOConfig {
  title: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article' | 'product' | 'service';
  customSchema?: Record<string, any>;
  breadcrumbs?: { name: string; url: string }[];
  noindex?: boolean;
}

const DEFAULT_DESCRIPTION = "Cabinet technologique spécialisé en Intelligence Artificielle, Data Science, Business Intelligence et Automatisation. Transformez vos données en avantage compétitif.";
const DEFAULT_IMAGE = "https://analyticatech.com/og-image.jpg";
const SITE_NAME = "Analyticatech";
const SITE_URL = "https://analyticatech.com";

export const usePageSEO = ({
  title,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_IMAGE,
  type = 'website',
  customSchema,
  breadcrumbs,
  noindex = false
}: SEOConfig) => {
  const location = useLocation();
  const fullTitle = `${title} | ${SITE_NAME}`;
  const currentUrl = `${SITE_URL}${location.pathname}`;

  useEffect(() => {
    // 1. TITRE
    document.title = fullTitle;

    // Helper pour mettre à jour/créer une meta
    const updateMeta = (name: string, content: string, attr: 'name' | 'property' = 'name') => {
      let element = document.querySelector(`meta[${attr}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 2. META ESSENTIELLES
    updateMeta('description', description);
    if (noindex) {
      updateMeta('robots', 'noindex, nofollow');
    } else {
      updateMeta('robots', 'index, follow, max-image-preview:large');
    }
    updateMeta('author', SITE_NAME);

    // 3. OPEN GRAPH (LinkedIn, Facebook, Slack)
    updateMeta('og:title', fullTitle, 'property');
    updateMeta('og:description', description, 'property');
    updateMeta('og:image', image, 'property');
    updateMeta('og:url', currentUrl, 'property');
    updateMeta('og:type', type, 'property');
    updateMeta('og:site_name', SITE_NAME, 'property');
    updateMeta('og:locale', 'fr_FR', 'property');

    // 4. TWITTER CARDS
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:site', '@analyticatech');
    updateMeta('twitter:title', fullTitle);
    updateMeta('twitter:description', description);
    updateMeta('twitter:image', image);

    // 5. CANONICAL URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = currentUrl;

    // 6. JSON-LD STRUCTURED DATA (GOOGLE RICH SNIPPETS)
    const schemas: Record<string, any>[] = [];

    // Schema de base : ProfessionalService
    schemas.push({
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "name": SITE_NAME,
      "alternateName": "Analyticatech Systems",
      "image": image,
      "url": currentUrl,
      "logo": `${SITE_URL}/favicon.svg`,
      "telephone": "+33 1 00 00 00 00",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "1 rue François 1er",
        "addressLocality": "Paris",
        "postalCode": "75008",
        "addressCountry": "FR"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 48.8665,
        "longitude": 2.3212
      },
      "priceRange": "€€€",
      "description": description,
      "areaServed": {
        "@type": "Country",
        "name": "France"
      },
      "sameAs": [
        "https://www.linkedin.com/company/analyticatech"
      ]
    });

    // Schema BreadcrumbList si breadcrumbs fournis
    if (breadcrumbs && breadcrumbs.length > 0) {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbs.map((crumb, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": crumb.name,
          "item": crumb.url
        }))
      });
    }

    // Schema personnalisé si fourni
    if (customSchema) {
      schemas.push(customSchema);
    }

    // Injecter le JSON-LD
    let script = document.querySelector('#json-ld-dynamic') as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.id = 'json-ld-dynamic';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(schemas.length === 1 ? schemas[0] : schemas);

    // Cleanup
    return () => {
      // Optionnel : nettoyer les meta au démontage
    };
  }, [location, fullTitle, description, image, type, customSchema, breadcrumbs, noindex, currentUrl]);
};

// Export par défaut pour compatibilité
export default usePageSEO;
