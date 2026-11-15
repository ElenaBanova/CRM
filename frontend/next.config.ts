import type {NextConfig} from "next";

const backend = process.env.BASE_URL || "http://localhost:5000";

const nextConfig: NextConfig = {
    experimental: {
        serverActions: {
            allowedOrigins: ['localhost:8080'],
        },
    },
    async rewrites() {
        return [
            {
                source: "/api/:path*",
                destination: `${backend}/:path*`,
            },
        ];
    },
}

export default nextConfig;
