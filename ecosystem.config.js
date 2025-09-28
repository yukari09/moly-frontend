module.exports = {
  apps: [
    {
      name: "dattk",
      script: "bun",
      args: "run start -- -p 3000",
      cwd: "apps/dattk",
      env: {
        NODE_ENV: "production",
      },
    }
  ],
};
