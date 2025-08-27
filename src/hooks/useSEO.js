import { useEffect } from 'react';

/**
 * Custom hook for managing SEO meta tags dynamically
 * Leverages React 19's improved performance for DOM updates
 */
export const useSEO = ({
    title,
    description,
    keywords,
    ogImage,
    canonicalUrl,
    structuredData
}) => {
    useEffect(() => {
        // Update document title
        if (title) {
            document.title = title;
        }

        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription && description) {
            metaDescription.setAttribute('content', description);
        }

        // Update meta keywords
        const metaKeywords = document.querySelector('meta[name="keywords"]');
        if (metaKeywords && keywords) {
            metaKeywords.setAttribute('content', keywords);
        }

        // Update Open Graph image
        const ogImageMeta = document.querySelector('meta[property="og:image"]');
        if (ogImageMeta && ogImage) {
            ogImageMeta.setAttribute('content', ogImage);
        }

        // Update canonical URL
        let canonicalLink = document.querySelector('link[rel="canonical"]');
        if (canonicalUrl) {
            if (!canonicalLink) {
                canonicalLink = document.createElement('link');
                canonicalLink.rel = 'canonical';
                document.head.appendChild(canonicalLink);
            }
            canonicalLink.href = canonicalUrl;
        }

        // Update structured data
        if (structuredData) {
            let structuredDataScript = document.querySelector('script[type="application/ld+json"]#dynamic-seo');
            if (!structuredDataScript) {
                structuredDataScript = document.createElement('script');
                structuredDataScript.type = 'application/ld+json';
                structuredDataScript.id = 'dynamic-seo';
                document.head.appendChild(structuredDataScript);
            }
            structuredDataScript.textContent = JSON.stringify(structuredData);
        }
    }, [title, description, keywords, ogImage, canonicalUrl, structuredData]);
};

/**
 * Hook for managing page analytics and user behavior tracking
 * Useful for SEO insights and performance monitoring
 */
export const usePageAnalytics = (pageName) => {
    useEffect(() => {
        // Track page view (replace with your analytics service)
        console.log(`Page viewed: ${pageName} at ${new Date().toISOString()}`);
        
        // Track user engagement metrics
        const startTime = Date.now();
        
        // Track scroll depth
        const handleScroll = () => {
            const scrollPercent = Math.round(
                (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
            );
            if (scrollPercent % 25 === 0 && scrollPercent > 0) {
                console.log(`Scroll depth: ${scrollPercent}% on ${pageName}`);
            }
        };

        // Track time on page
        const handleBeforeUnload = () => {
            const timeSpent = Math.round((Date.now() - startTime) / 1000);
            console.log(`Time spent on ${pageName}: ${timeSpent} seconds`);
        };

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [pageName]);
};
