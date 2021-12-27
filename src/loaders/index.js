import currencyRoutes from '../api/routes/currencyRoutes.js';

function createRoutes(app) {
  app.use('/currencies', currencyRoutes);
}

export default createRoutes;
