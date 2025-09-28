module.exports = {
  apps: [
    {
      name: "dattk",
      script: "bun",
      args: "./apps/dattk/.next/standalone/apps/dattk/server.js",
      cwd: "apps/dattk",
      env: {
        PORT: 3000,
        NODE_ENV: "production",
      },
    }
  ],
};
