const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://10.97.184.97:7000/api/:path*",
      },
    ];
  },
};

module.exports = nextConfig;