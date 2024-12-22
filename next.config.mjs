/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cdn-icons-png.flaticon.com',
                port: '', // Leave empty for default ports
                pathname: '/**', // Allow all paths under this hostname
            },
        ],
    },
};

export default nextConfig;