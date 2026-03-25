/**
 * SEO Schema.org Utilities
 * Reusable structured data generators for schema.org JSON-LD
 */

export interface SchemaOrganization {
  "@context": string;
  "@type": string;
  name: string;
  url: string;
  logo: string;
  description: string;
  foundingDate?: string;
  areaServed: {
    "@type": string;
    name: string;
  };
  sameAs: string[];
  contactPoint: Array<{
    "@type": string;
    contactType: string;
    telephone: string;
    areaServed: string;
    availableLanguage: string[];
  }>;
}

export interface SchemaService {
  "@context": string;
  "@type": string;
  name: string;
  description: string;
  provider: {
    "@type": string;
    name: string;
  };
  areaServed: {
    "@type": string;
    name: string;
  };
  priceRange?: string;
  offers?: Array<{
    "@type": string;
    priceCurrency: string;
    price: string;
    description?: string;
  }>;
}

export interface SchemaAggregateRating {
  "@context": string;
  "@type": string;
  name: string;
  description: string;
  aggregateRating: {
    "@type": string;
    ratingValue: number;
    reviewCount: number;
  };
  review?: Array<{
    "@type": string;
    author: {
      "@type": string;
      name: string;
    };
    reviewRating: {
      "@type": string;
      ratingValue: number;
    };
    reviewBody: string;
  }>;
}

export interface SchemaBreadcrumb {
  "@context": string;
  "@type": string;
  itemListElement: Array<{
    "@type": string;
    position: number;
    name: string;
    item: string;
  }>;
}

/**
 * Organization Schema Generator
 * Used for company-wide structured data
 */
export function generateOrganizationSchema(
  name: string,
  url: string,
  logo: string,
  description: string,
  areaServed: string = "Indonesia",
  socialProfiles: string[] = [],
  contactPhone?: string
): SchemaOrganization {
  const contactPoint = contactPhone
    ? [
        {
          "@type": "ContactPoint",
          contactType: "customer support",
          telephone: contactPhone,
          areaServed: "ID",
          availableLanguage: ["id"],
        },
      ]
    : [];

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url,
    logo,
    description,
    areaServed: {
      "@type": "Country",
      name: areaServed,
    },
    sameAs: socialProfiles,
    contactPoint: contactPoint as SchemaOrganization["contactPoint"],
  };
}

/**
 * LocalBusiness Schema Generator
 * Used for location-specific business information
 */
export function generateLocalBusinessSchema(
  name: string,
  description: string,
  url: string,
  logo: string,
  serviceArea: string = "Indonesia",
  phone?: string,
  email?: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name,
    description,
    url,
    logo,
    serviceArea: {
      "@type": "Country",
      name: serviceArea,
    },
    ...(phone && { telephone: phone }),
    ...(email && { email }),
    priceRange: "$",
  };
}

/**
 * Service Schema Generator
 * Describes individual services offered
 */
export function generateServiceSchema(
  name: string,
  description: string,
  providerName: string = "Daydev",
  areaServed: string = "Indonesia",
  priceRange?: string
): SchemaService {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    provider: {
      "@type": "Organization",
      name: providerName,
    },
    areaServed: {
      "@type": "Country",
      name: areaServed,
    },
    ...(priceRange && { priceRange }),
  };
}

/**
 * Offer Schema Generator
 * Used for pricing/offers information
 */
export function generateOfferSchema(
  itemName: string,
  price: string,
  currency: string = "IDR",
  description?: string
) {
  return {
    "@type": "Offer",
    itemOffered: {
      "@type": "Service",
      name: itemName,
      ...(description && { description }),
    },
    priceCurrency: currency,
    price,
  };
}

/**
 * AggregateRating Schema Generator
 * Displays review ratings and counts
 */
export function generateAggregateRatingSchema(
  name: string,
  description: string,
  ratingValue: number,
  reviewCount: number,
  reviews?: Array<{
    author: string;
    rating: number;
    text: string;
  }>
): SchemaAggregateRating {
  const reviewsArray = reviews
    ? reviews.map((review) => ({
        "@type": "Review",
        author: {
          "@type": "Person",
          name: review.author,
        },
        reviewRating: {
          "@type": "Rating",
          ratingValue: review.rating,
        },
        reviewBody: review.text,
      }))
    : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name,
    description,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue,
      reviewCount,
    },
    ...(reviewsArray && { review: reviewsArray }),
  };
}

/**
 * FAQ Schema Generator
 * Structured data for FAQ sections
 */
export function generateFAQSchema(
  faqs: Array<{
    question: string;
    answer: string;
  }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * BreadcrumbList Schema Generator
 * For navigation hierarchy
 */
export function generateBreadcrumbSchema(
  items: Array<{
    name: string;
    url: string;
  }>
): SchemaBreadcrumb {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Article/BlogPosting Schema Generator
 * For blog articles and content pieces
 */
export function generateArticleSchema(
  title: string,
  description: string,
  author: string,
  datePublished: string,
  dateModified?: string,
  imageUrl?: string,
  articleBody?: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    author: {
      "@type": "Person",
      name: author,
    },
    datePublished,
    ...(dateModified && { dateModified }),
    ...(imageUrl && {
      image: {
        "@type": "ImageObject",
        url: imageUrl,
      },
    }),
    ...(articleBody && { articleBody }),
  };
}

/**
 * Product/Service Rating Schema Generator
 * For individual product/service ratings
 */
export function generateProductRatingSchema(
  productName: string,
  description: string,
  ratingValue: number,
  reviewCount: number,
  price?: string,
  currency?: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: productName,
    description,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue,
      reviewCount,
    },
    ...(price && currency && {
      offers: {
        "@type": "Offer",
        price,
        priceCurrency: currency,
      },
    }),
  };
}
