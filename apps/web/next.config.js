/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  crons: [
    {
      path: '/api/cron',
      schedule: '*/5 * * * *' // every 5 minutes
    }
  ]
};

module.exports = nextConfig;
