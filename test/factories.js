const Cliente = require('../src/cliente');



const CrearCliente = (nombreCliente, numeroCliente) => {
    return new Cliente(nombreCliente, numeroCliente)

};

module.exports = CrearCliente;