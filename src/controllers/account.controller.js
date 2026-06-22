class AccountController {
  constructor(financeService) {
    this.financeService = financeService;
  }

/**
 * Endpoint para obtener el saldo actual de una cuenta (Alpha).
 * GET /v1/account-alpha/balance
 * 
 * Se espera recibir el parámetro 'accountId' por query string o desde el req.user (si ya está autenticado).
 */

getBalance = (req, res) => {
    try {
      const accountId = req.query.accountId;
      
      if (!accountId) {
        return res.status(400).json({
          error: 'peticion incorrecta',
          message: 'falta el parametro accountid'
        });
      }

      const accountInfo = this.financeService.getAccountInfo(accountId);
      return res.status(200).json(accountInfo);
    } catch (error) {
      return res.status(404).json({
        error: 'recurso no encontrado',
        message: error.message
      });
    }
  }
}

module.exports = AccountController;