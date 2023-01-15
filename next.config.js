// next.config.js
const withNextra = require("nextra")({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.jsx",
  defaultShowCopyCode: true
  // optional: add `unstable_staticImage: true` to enable Nextra's auto image import
});
module.exports = withNextra({
  images: {
    loader: 'akamai',
    path: '/',
    domains: ['discordapp.com'],
  },
  experimental: {
    allowMiddlewareResponseBody: true,
  },
});
