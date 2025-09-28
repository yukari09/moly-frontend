module.exports = {
  apps: [
    {
      name: "dattk",
      script: "bun",
      args: "./server.js",
      cwd: "apps/dattk",
      env: {
        PORT: 3000,
        NODE_ENV: "production",
      },
    },
    {
      name: "impressifyai",
      script: "bun",
      args: "./server.js",
      cwd: "apps/impressifyai",
      env: {
        PORT: 3001,
        NODE_ENV: "production",
      },
    }
  ],
};
