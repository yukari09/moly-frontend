module.exports = {
  apps: [
    {
      name: "dattk",
      script: "bun",
      args: "run next start --port 3000 --dir apps/dattk",
      cwd: ".",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        NEXT_PUBLIC_TURNSTILE_SITE_KEY: "0x4AAAAAABLfdqrrH9bmKIai",
        NEXT_PUBLIC_SITE_URL: "https://dattk.com",
        NEXT_PUBLIC_GA_ID: "G-PYBYBYGL2R",
        NEXT_PUBLIC_IMAGE_HOST: "https://image.dattk.com"
      },
    }
  ],
};
