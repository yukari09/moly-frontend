import createNextIntlPlugin from 'next-intl/plugin';
 
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'http',
                hostname: '192.168.6.2',
            },
            {
                protocol: "https",
                hostname: "image.impressifyai.com"
            },
        ],
        formats: ['image/webp'],
    },
    output: 'standalone'
};
 
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);