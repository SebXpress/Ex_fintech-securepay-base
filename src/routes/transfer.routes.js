const express = require('express');
const router = express.Router();
const TransferController = require('../controllers/transfer.controller');
const AccountRepository = require('../repositories/account.repository');
const TransactionRepository = require('../repositories/transaction.repository');
const NotificationService = require('../services/notification.service');
const FinanceService = require('../services/finance.service');
const authMiddleware = require('../middlewares/auth.middleware');

// ensamble inyectado de dependencias financieras
const accountRepository = new AccountRepository();
const transactionRepository = new TransactionRepository();
const notificationService = new NotificationService();
const financeService = new FinanceService(accountRepository, transactionRepository, notificationService);
const transferController = new TransferController(financeService);

// POST /v1/transfer-beta/execute
router.post('/execute', authMiddleware, transferController.executeTransfer);

module.exports = router;
