const transactionsHistory = [];

class TransactionRepository {
  // persistencia del historial de transferencias
  save(fromAccountId, toAccountId, amount) {
    const newTransaction = {
      transactionId: `TX-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      from: fromAccountId,
      to: toAccountId,
      amount: amount,
      status: 'COMPLETED',
      timestamp: new Date().toISOString()
    };
    transactionsHistory.push(newTransaction);
    return newTransaction;
  }
}

module.exports = TransactionRepository;