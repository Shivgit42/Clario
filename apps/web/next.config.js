/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      // YouTube thumbnails
      { protocol: "https", hostname: "img.youtube.com", pathname: "/vi/**" },
      { protocol: "https", hostname: "i.ytimg.com", pathname: "/vi/**" },

      // Google user avatars
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh4.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh1.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh2.googleusercontent.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
