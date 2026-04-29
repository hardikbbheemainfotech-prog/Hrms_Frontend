<<<<<<< HEAD
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

=======
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://10.25.155.145:7000/api/:path*",
      },
    ];
  },
};

>>>>>>> 0958281 (hr)
module.exports = nextConfig;