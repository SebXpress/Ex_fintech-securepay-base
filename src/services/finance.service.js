class FinanceService {
  // aplicamos Inversión de Dependencias (DIP) inyectando de dependencias de bajo nivel por constructor
  constructor(accountRepository, transactionRepository, notificationService) {
    this.accountRepository = accountRepository;
    this.transactionRepository = transactionRepository;
    this.notificationService = notificationService;
  }

  // reglas de negocio financieras
  processTransfer(fromAccountId, toAccountId, amount) {
    // CUENTA ORIGEN NO EXISTTE
    const sender = this.accountRepository.findAccountById(fromAccountId);
    if (!sender) {
      throw new Error(`la cuenta origen '${fromAccountId}' no existe`);
    }

    // cuenta destino no existe
    const receiver = this.accountRepository.findAccountById(toAccountId);
    if (!receiver) {
      throw new Error(`la cuenta destino '${toAccountId}' no existe`);
    }

    // transferencia de un valor valido
    if (amount <= 0) {
      throw new Error('el monto a transferir debe ser mayor a cero');
    }

    // saldo < al valor de transferencia
    if (sender.balance < amount) {
      throw new Error(`saldo insuficiente en cuenta '${fromAccountId}'`);
    }

    this.accountRepository.updateBalances(sender, receiver, amount);
    const transaction = this.transactionRepository.save(fromAccountId, toAccountId, amount);
    this.notificationService.sendTransferEmails(sender, receiver, fromAccountId, amount);

    return {
      success: true,
      message: 'transferencia ejecutada con exito',
      transaction,
      balanceRestante: sender.balance
    };
  }


  getAccountInfo(accountId) {
    const account = this.accountRepository.findAccountById(accountId);
    if (!account) {
      throw new Error(`la cuenta '${accountId}' no existe`);
    }
    return {
      accountId: account.accountAlpha,
      email: account.email,
      balance: account.balance
    };
  }
}

module.exports = FinanceService;