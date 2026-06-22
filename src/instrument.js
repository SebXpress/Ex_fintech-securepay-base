const Sentry = require("@sentry/node");

// inicializacion asincrona del sdk de observabilidad distribuidora
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: "production",
  tracesSampleRate: 1.0,
});

console.log("Instrumentacion lista de Sentry");