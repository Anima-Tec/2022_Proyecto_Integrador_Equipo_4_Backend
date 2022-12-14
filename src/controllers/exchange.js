const exchangeDA = require("../dataaccess/exchange");
const productDA = require("../dataaccess/product");
const userDA = require("../dataaccess/user");

const { RESULT_CODES } = require("../utils/index");

const createExchange = async ({ idO, idR, mensaje, userId }) => {
  try {
    const productSended = await productDA.getProductById({ id: idO });
    const productRecieved = await productDA.getProductById({ id: idR });

    if (!productSended || !productRecieved) {
      return {
        code: RESULT_CODES.PRODUCT_NOT_FOUND,
      };
    }

    if (productSended.userId === productRecieved.userId) {
      return {
        code: RESULT_CODES.SAME_USER,
      };
    }

    if (productSended.userId !== userId) {
      return {
        code: RESULT_CODES.NOT_PRODUCT_OWNER,
      };
    }

    if (!mensaje) {
      return {
        code: RESULT_CODES.MISSING_MESSAGE,
      };
    }

    const exchange = await exchangeDA.createExchange({
      id_producto_enviado: idO,
      id_producto_recibido: idR,
      mensaje,
    });

    return {
      exchange,
      code: RESULT_CODES.SUCCESS,
    };
  } catch (error) {
    throw new Error(error);
  }
};

const editExchangeState = async ({ id, estado, userId }) => {
  try {
    if (estado != "ACEPTADO" && estado != "RECHAZADO") {
      return {
        code: RESULT_CODES.INVALID_EXCHANGE_TYPE,
      };
    }

    if (estado === "ACEPTADO") {
      const exchange = await exchangeDA.getExchangeById({ id });
      
      if (!exchange) {
        return {
          code: RESULT_CODES.EXCHANGE_NOT_FOUND,
        };
      }

      if (
        exchange.producto_enviado.userId !== userId &&
        exchange.producto_recibido.userId !== userId
      ) {
        return {
          code: RESULT_CODES.YOU_CANNOT_MAKE_THIS_ACTION,
        };
      }

      if (exchange.estado !== "ESPERANDO") {
        return {
          code: RESULT_CODES.EXCHANGE_ALREADY_ACCEPTED_REJECTED
        };
      }

      if (exchange.producto_enviado.userId === userId) {
        return {
          code: RESULT_CODES.YOU_CANNOT_MAKE_THIS_ACTION,
        };
      }

      const editExchangeState = await exchangeDA.editState({ id, estado });

      if (editExchangeState.estado === "ACEPTADO") {
        await userDA.incrementExchangeCount({ id: exchange.producto_enviado.userId });
        await userDA.incrementExchangeCount({ id: exchange.producto_recibido.userId });
        await productDA.decrementCountProduct({id: editExchangeState.producto_enviado.id});
        await productDA.decrementCountProduct({id: editExchangeState.producto_recibido.id});
      }

      const formattedExchange = {...editExchangeState, tu_producto: editExchangeState.producto_enviado.userId === userId ? editExchangeState.producto_enviado : editExchangeState.producto_recibido, otro_producto: editExchangeState.producto_enviado.userId !== userId ? editExchangeState.producto_enviado : editExchangeState.producto_recibido}

      delete formattedExchange.producto_enviado
      delete formattedExchange.producto_recibido

      return {
        ...formattedExchange,
        code: RESULT_CODES.SUCCESS,
      };
    }

    if (estado === "RECHAZADO") {
      const exchange = await exchangeDA.getExchangeById({ id });

      if (!exchange) {
        return {
          code: RESULT_CODES.EXCHANGE_NOT_FOUND,
        };
      }

      if (
        exchange.producto_enviado.userId !== userId &&
        exchange.producto_recibido.userId !== userId
      ) {
        return {
          code: RESULT_CODES.YOU_CANNOT_MAKE_THIS_ACTION,
        };
      }

      if (exchange.estado !== "ESPERANDO") {
        return {
          code: RESULT_CODES.EXCHANGE_ALREADY_ACCEPTED_REJECTED
        };
      }

      if (exchange.producto_enviado.userId === userId) {
        const editExchangeState = await exchangeDA.editState({ id, estado:'CANCELADO' });
        return {
          ...editExchangeState,
          code: RESULT_CODES.SUCCESS,
        }
      }

      if (exchange.producto_recibido.userId === userId) {
        const editExchangeState = await exchangeDA.editState({ id, estado:'RECHAZADO' });
        return {
          ...editExchangeState,
          code: RESULT_CODES.SUCCESS,
        }
      }
    }

  } catch (error) {
    throw new Error(error);
  }
};

const getExchangeById = async ({ id, userId }) => {
  try {
    const exchange = await exchangeDA.getExchangeById({ id });

    if (!exchange) {
      return {
        code: RESULT_CODES.EXCHANGE_NOT_FOUND,
      };
    }

    if (
      exchange.producto_enviado.userId !== userId &&
      exchange.producto_recibido.userId !== userId
    ) {
      return {
        code: RESULT_CODES.NOT_EXCHANGE_OWNER,
      };
    }

    if (!exchange) {
      return {
        code: RESULT_CODES.EXCHANGE_NOT_FOUND
      }
    }

    if (exchange.producto_enviado.userId !== userId && exchange.producto_recibido.userId !== userId) {
      return {
        code: RESULT_CODES.NOT_EXCHANGE_OWNER
      }
    }

    const formattedExchange = {
      ...exchange,
      tu_producto: exchange.producto_enviado.userId === userId ? exchange.producto_enviado : exchange.producto_recibido, 
      otro_producto: exchange.producto_enviado.userId !== userId ? exchange.producto_enviado : exchange.producto_recibido,
      isRecieved: exchange.producto_recibido.userId === userId,
    }

    delete formattedExchange.producto_enviado
    delete formattedExchange.producto_recibido

    return formattedExchange;
  } catch (error) {
    console.log(error)
    throw new Error(error);
  }
};

const getMyExchangesByParams = async ({ userId, exchangeType }) => {
  try {
    if (exchangeType === "enviado" || exchangeType === "recibido") {
      const exchanges = await exchangeDA.getMyExchangesByParams({
        userId,
        exchangeType,
      });
      return exchanges;
    }

    return {
      code: RESULT_CODES.INVALID_EXCHANGE_TYPE,
    };
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  createExchange,
  editExchangeState,
  getExchangeById,
  getMyExchangesByParams,
};
