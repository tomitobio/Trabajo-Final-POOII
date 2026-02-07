const Cliente = require('../src/cliente');
const Paquete = require('../src/paquete');
const Consumo = require('../src/consumo');

const CrearPaquete = (datosMoviles, minutosminutosLlamada, diasDuracion, costo) => {
    return new Paquete(datosMoviles, minutosminutosLlamada, diasDuracion, costo)

};

const CrearCliente = (nombreCliente, numeroLinea) => {
    return new Cliente(nombreCliente, numeroLinea)

};

const CrearConsumo = (tipoConsumo, cantidadConsumida, fechaDeInicio, fechaDeFin) => {
    return new Consumo(tipoConsumo, cantidadConsumida, fechaDeInicio, fechaDeFin)
};

module.exports = { CrearCliente, CrearPaquete, CrearConsumo };