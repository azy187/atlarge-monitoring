module.exports = {
  apps: [
    {
      name: "api-server",
      script: "src/main.ts",
      cwd: "apps/api/v1",
      interpreter: "npx",
      interpreter_args: "ts-node",
      watch: true,
    },
  ],
};
