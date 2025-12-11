import React, { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  name?: string;
  type?: string;
  image?: string;
  url?: string;
}

const SEO: React.FC<SEOProps> = ({ 
  title, 
  description, 
  name = 'StudiRad', 
  type = 'website',
  image = './logo.svg',
  url
}) => {
  const siteTitle = `${title} | ${name}`;
  const currentUrl = url || window.location.href;

  useEffect(() => {
    // 1. Update Title
    document.title = siteTitle;

    // 2. Helper to update or create meta tags
    const setMetaTag = (attrName: string, attrValue: string, content: string) => {
      let element = document.querySelector(`meta[${attrName}="${attrValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 3. Update Standard Meta Tags
    setMetaTag('name', 'description', description);
    
    // 4. Update Canonical Link
    let linkCanonical = document.querySelector("link[rel='canonical']");
    if (!linkCanonical) {
        linkCanonical = document.createElement('link');
        linkCanonical.setAttribute('rel', 'canonical');
        document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', currentUrl);

    // 5. Update Open Graph (Facebook/LinkedIn)
    setMetaTag('property', 'og:type', type);
    setMetaTag('property', 'og:title', siteTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:image', image);
    setMetaTag('property', 'og:url', currentUrl);

    // 6. Update Twitter
    setMetaTag('name', 'twitter:creator', name);
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', siteTitle);
    setMetaTag('name', 'twitter:description', description);

  }, [siteTitle, description, type, image, currentUrl, name]);

  return null;
};

export default SEO;