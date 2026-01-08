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
  image = 'icon-512.png',
  url
}) => {
  useEffect(() => {
    document.title = `${title} | ${name}`;
    const setMetaTag = (selector: string, content: string, attribute = 'name') => {
      let element = document.querySelector(`meta[${attribute}="${selector}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, selector);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };
    setMetaTag('description', description);
    setMetaTag('og:type', type, 'property');
    setMetaTag('og:title', `${title} | ${name}`, 'property');
    setMetaTag('og:description', description, 'property');
    setMetaTag('og:image', image, 'property');
    setMetaTag('og:url', url || window.location.href, 'property');
    setMetaTag('og:site_name', name, 'property');
    setMetaTag('twitter:creator', name);
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', `${title} | ${name}`);
    setMetaTag('twitter:description', description);
    if (image) setMetaTag('twitter:image', image);
  }, [title, description, name, type, image, url]);
  return null;
};

export default SEO;