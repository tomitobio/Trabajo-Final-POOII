const Cliente = require('../src/cliente');
const Paquete = require('../src/paquete');

const CrearPaquete = (datosMoviles, minutosLlamada, diasDuracion, costo) => {
    return new Paquete(datosMoviles, minutosLlamada, diasDuracion, costo)

};

const CrearCliente = (nombreCliente, numeroLinea) => {
    return new Cliente(nombreCliente, numeroLinea)

};

module.exports = { CrearCliente, CrearPaquete };