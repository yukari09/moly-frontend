module.exports = {
  apps: [
    {
      name: "dattk",
      script: "bun",
      args: "next start -p 3000",
      cwd: "apps/dattk",
      env: {
        NODE_ENV: "production",
      },
    }
  ],
};