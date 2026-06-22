// TODO (Estudiante): Configurar e inicializar Sentry Node SDK para la observabilidad ANTES de importar Express o cualquier otra librería.
// Pistas:
// const Sentry = require('@sentry/node');
// Sentry.init({ dsn: process.env.SENTRY_DSN, tracesSampleRate: 1.0 });

// linea obligatoria para evitar fugas de trazas
require("./src/instrument");

// Modificamos el archivo de arranque raíz del microservicio para asegurar que sea la línea número uno absoluta, previniendo fugas de trazas y capturando el ciclo completo.
require('dotenv').config();
const express = require('express');
const routes = require('./src/routes');
const Sentry = require("@sentry/node");

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración básica para parsear JSON en las peticiones HTTP
app.use(express.json());

const jwtService = require('./src/services/jwt.service');

// endpoint de autenticacion minima para el examen
app.post('/auth/token', (req, res) => {
  const userSimulado = {
    id: 'usr_001',
    email: 'estudiante.alpha@espe.edu.ec'
  };

  try {
    const token = jwtService.signToken(userSimulado);
    return res.status(200).json({
      success: true,
      token: token
    });
  } catch (error) {
    return res.status(500).json({
      error: 'error al firmar credenciales',
      message: error.message
    });
  }
});

// Montar el enrutador principal en /v1
app.use('/v1', routes);

// Endpoint base informativo
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'fintech-securepay-base',
    description: 'API base para evaluaciones de aplicaciones distribuidas (ESPE)',
    status: 'ONLINE'
  });
});

// Manejo centralizado de excepciones y reporte a Sentry
// TODO (Estudiante): Integrar el middleware de errores de Sentry: Sentry.setupExpressErrorHandler(app);
// capturador centralizado de errores operacionales 500 y reporte automatico a sentry
app.use((err, req, res, next) => {
  console.error('[SERVER ERROR]:', err);
  
  // enriquecimiento de contexto sentry con datos extraidos del token jwt
  if (req.user) {
    Sentry.setTag("affected_user_id", req.user.id);
    Sentry.setUser({ id: req.user.id, email: req.user.email });
  }
  
  Sentry.setTag("error_type", "OperationalError");
  const eventId = Sentry.captureException(err);

  res.status(500).json({
    error: 'error interno del servidor',
    message: err.message,
    sentryEventId: eventId
  });
});

app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 Servidor Fintech ejecutándose en: http://localhost:${PORT}`);
  console.log(`   - Balance Alpha: GET http://localhost:${PORT}/v1/account-alpha/balance`);
  console.log(`   - Transferencia Beta: POST http://localhost:${PORT}/v1/transfer-beta/execute`);
  console.log(`======================================================\n`);
});
