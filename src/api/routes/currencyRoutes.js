import { Router } from 'express';
import { CurrencyService } from '../../services/index.js';

const router = Router();
const service = new CurrencyService();

router.use(function (req, res, next) {
  console.log(`Request Time: ${Date.now()} | URL: ${req.originalUrl}`);
  next();
});

router.get('/', async (req, res) => {
  const currencies = await service.getAll();
  res.send(currencies);
});

router.get('/search', async (req, res) => {
  const searchQuery = req.query['query'];

  const currencies = await service.getByTitle(searchQuery);
  res.send(currencies);
});

router.get('/exchange', async (req, res) => {
  const from = req.query['from'];
  const to = req.query['to'];
  const amount = req.query['amount'];

  const currency = await service.exchange(from, to, amount);

  res.send(currency);
});

router.get('/details/:currencyId', async (req, res) => {
  const { currencyId } = req.params;

  const currency = await service.getById(currencyId);

  res.send(currency);
});

router.post('/', (req, res) => {
  res.send('post');
});

export default router;
