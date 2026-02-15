const Cliente = require('../src/cliente');
const Paquete = require('../src/paquete');
const Consumo = require('../src/consumo');
const { AplicacionEstandar } = require('../src/aplicacion');

const CrearPaquete = (datosMoviles, minutosLlamada, diasDuracion, costo) => {
    return new Paquete(datosMoviles, minutosLlamada, diasDuracion, costo)

};

const CrearCliente = (nombreCliente, numeroLinea) => {
    return new Cliente(nombreCliente, numeroLinea)

};

const CrearConsumo = (tipoConsumo, cantidadConsumida, fechaDeInicio, fechaDeFin, appConsumida = new AplicacionEstandar()) => {
    return new Consumo(tipoConsumo, cantidadConsumida, fechaDeInicio, fechaDeFin, appConsumida)
};

module.exports = { CrearCliente, CrearPaquete, CrearConsumo };