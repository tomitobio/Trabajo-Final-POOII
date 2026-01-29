const Cuenta = function(nombreCliente, numeroCuenta) {

    this.nombreCliente = nombreCliente;
    this.numeroCuenta = numeroCuenta;
    this.saldo = 0;

    this.obtenerSaldo = () => this.saldo;
    

    // esto es otro   comentario

};



module.exports = Cuenta;