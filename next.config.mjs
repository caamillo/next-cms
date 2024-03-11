/** @type {import('next').NextConfig} */
const nextConfig = {
    i18n: {
        locales: [ 'default', 'en', 'it' ],
        defaultLocale: 'default',
        ignoreRoutes: [
            '/panel/'
        ]
    }
};

export default nextConfig;
