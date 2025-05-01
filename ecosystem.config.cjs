module.exports = {
  apps: [
    {
      name: "Gymyatra",
      script: "app.js", // Node.js application
      watch: false,
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
