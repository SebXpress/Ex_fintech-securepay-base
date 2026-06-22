// simulamos una base de datos aislada
const usersDb = [
  { id: 'usr_001', email: 'estudiante.alpha@espe.edu.ec', accountAlpha: 'ACC-12345', balance: 1500.00 },
  { id: 'usr_002', email: 'docente.beta@espe.edu.ec', accountAlpha: 'ACC-67890', balance: 350.50 }
];

class AccountRepository {
  // buscar cuenta por identificador unico
  findAccountById(accountId) {
    return usersDb.find(u => u.accountAlpha === accountId);
  }

  // mutacion controlada de saldos financieros
  updateBalances(senderAccount, receiverAccount, amount) {
    senderAccount.balance -= amount;
    receiverAccount.balance += amount;
    return { senderBalance: senderAccount.balance, receiverBalance: receiverAccount.balance };
  }
}

module.exports = AccountRepository;