import { memo, Suspense } from 'react';

/**
 * Performance-optimized image component with SEO benefits
 * Uses React 19's enhanced performance features
 */
export const SEOImage = memo(({ 
    src, 
    alt, 
    width, 
    height, 
    loading = "lazy",
    className = "",
    ...props 
}) => {
    return (
        <img
            src={src}
            alt={alt}
            width={width}
            height={height}
            loading={loading}
            className={className}
            {...props}
            // Add structured data attributes for better SEO
            itemProp="image"
        />
    );
});

SEOImage.displayName = 'SEOImage';

/**
 * Lazy loading wrapper component for better performance
 * Improves Core Web Vitals scores
 */
export const LazySection = ({ children, className = "" }) => {
    return (
        <Suspense fallback={
            <div className={`animate-pulse bg-gray-200 rounded ${className}`} 
                 style={{ minHeight: '200px' }}>
                <div className="flex items-center justify-center h-full">
                    <div className="text-gray-500">Cargando...</div>
                </div>
            </div>
        }>
            <section className={className}>
                {children}
            </section>
        </Suspense>
    );
};
