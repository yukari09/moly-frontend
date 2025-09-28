module.exports = {
  apps: [
    {
      name: "dattk",
      script: "bun",
      args: ["run", "start"],
      cwd: "apps/dattk",
      env: {
        NODE_ENV: "production",
      },
    }
  ],
};
