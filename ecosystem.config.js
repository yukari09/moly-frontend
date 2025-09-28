module.exports = {
  apps: [
    {
      name: "dattk",
      script: "bun",
      args: "run next start --port 3000 --dir apps/dattk",
      cwd: ".",
      env: {
        NODE_ENV: "production",
        PORT: 3000
      },
    }
  ],
};
