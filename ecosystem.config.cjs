export default {
  apps: [
    {
      name: "Gymyatra",
      script: "server.js", // Node.js application
      watch: false,
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
