module.exports = {
  apps: [
    {
      name: "dattk",
      script: "./node_modules/.bin/next",
      args: "start",
      cwd: "apps/dattk",
      env: {
        NODE_ENV: "production",
      },
    }
  ],
};
