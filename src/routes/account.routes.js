const express = require('express');
const router = express.Router();
const AccountController = require('../controllers/account.controller');
const AccountRepository = require('../repositories/account.repository');
const FinanceService = require('../services/finance.service');
const authMiddleware = require('../middlewares/auth.middleware');

// ensamble manual de dependencias
const accountRepository = new AccountRepository();
const financeService = new FinanceService(accountRepository, null, null);
const accountController = new AccountController(financeService);

// GET /v1/account-alpha/balance
router.get('/balance', authMiddleware, accountController.getBalance);

module.exports = router;
