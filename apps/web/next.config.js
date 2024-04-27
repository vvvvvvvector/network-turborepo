/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  crons: [
    {
      path: '/api/cron',
      schedule: '0 0/1 * 1/1 * ? *'
    }
  ]
};

module.exports = nextConfig;
