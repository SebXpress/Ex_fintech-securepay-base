// modificamos los controladores transformandolos a clases  para que reciban 
// la abstraccion del servicio financiero mediante inyecciones
// del constructor :3
class TransferController {
  constructor(financeService) {
    this.financeService = financeService;
  }
/**
 * Endpoint para ejecutar una transferencia bancaria (Beta).
 * POST /v1/transfer-beta/execute
 * 
 * Espera un cuerpo JSON con: { fromAccountId, toAccountId, amount }
 */

  executeTransfer = (req, res) => {
    try {
      const { fromAccountId, toAccountId, amount } = req.body;

//disparador manual de error operacional para la fase 3
      if (req.headers['x-simulate-db-crash'] === 'true') {
        throw new Error("conexion interrumpida con el cluster de datos securepay");
      }

      if (!fromAccountId || !toAccountId || amount === undefined) {
        return res.status(400).json({
          error: 'peticion incorrecta',
          message: 'campos obligatorios ausentes'
        });
      }

      const result = this.financeService.processTransfer(fromAccountId, toAccountId, Number(amount));
      return res.status(200).json(result);
    } catch (error) {
      // reenviar error operacional hacia el middleware centralizado
      if (error.message.includes("conexion interrumpida")) {
        return next(error);
      }
      return res.status(400).json({
        error: 'error en la transaccion',
        message: error.message
      });
    }
  }
}

module.exports = TransferController;