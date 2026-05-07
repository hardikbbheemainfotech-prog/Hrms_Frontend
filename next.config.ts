const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
       destination: "https://api.bheemainfotech.in/api/:path*",
      },
    ];
  },
};

module.exports = nextConfig;