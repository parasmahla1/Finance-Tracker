/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: {
            bodySizeLimit: "5mb", // Adjust as needed
        },
    },
};

export default nextConfig;
