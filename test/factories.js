const Cliente = require('../src/cliente');
const Paquete = require('../src/paquete');
const Consumo = require('../src/consumo');

const CrearPaquete = (datosMoviles, minutosLlamada, diasDuracion, costo) => {
    return new Paquete(datosMoviles, minutosLlamada, diasDuracion, costo)

};

const CrearCliente = (nombreCliente, numeroLinea) => {
    return new Cliente(nombreCliente, numeroLinea)

};

const CrearConsumo = (tipoConsumo, cantidadConsumida, fechaDeInicio, fechaDeFin, appConsumida = null) => {
    return new Consumo(tipoConsumo, cantidadConsumida, fechaDeInicio, fechaDeFin, appConsumida)
};

module.exports = { CrearCliente, CrearPaquete, CrearConsumo };