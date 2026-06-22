  // creamos la logica aislada para notificaciones externas por consola

class NotificationService {
  sendTransferEmails(sender, receiver, fromAccountId, amount) {
    console.log(`\n===[MENSAJE - EMAIL] correo de debito enviado a: ${sender.email}===`);
    console.log(`monto debitado de la cuenta ${fromAccountId}: $${amount}. nuevo saldo: $${sender.balance}`);
    
    console.log(`\n===[MENSAJE - EMAIL] correo de credito enviado a: ${receiver.email}===`);
    console.log(`monto recibido: $${amount}. nuevo saldo: $${receiver.balance}\n`);
  }
}

module.exports = NotificationService;