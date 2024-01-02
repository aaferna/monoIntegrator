module.exports = {
  apps: [
    {
      name: 'monoIntegrator',
      namespace: 'Integrator',
      script: 'index.js',
      instances: '2',
      instance_var: 'INSTANCE_ID',
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      restart_delay: 3000,
      env: {
        NODE_ENV: 'prd',
        PORT: 1900
      },
    },
  ],
};
