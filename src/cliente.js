const Cliente = function(nombreCliente, numeroCuenta) {
    this.nombreCliente = nombreCliente;
    this.numeroCuenta = numeroCuenta;

    // devuelve objeto manteniendo aislamiento
    this.obtenerInfoCliente = () => {
        return {
            nombre: this.nombreCliente,
            numeroCuenta: this.numeroCuenta
        };
    };

};

module.exports = Cliente;

