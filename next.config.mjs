import createNextIntlPlugin from 'next-intl/plugin';
 
const nextConfig = {
    experimental: {
        serverActions: {
            bodySizeLimit: '20mb',
        },
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'placehold.co',
            },
            {
                protocol: 'https',
                hostname: 'flagcdn.com',
            },
        ],
    },
};
 
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);