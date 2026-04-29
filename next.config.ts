const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://192.168.29.233:7000/api/:path*",
      },
    ];
  },
};

module.exports = nextConfig;