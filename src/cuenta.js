const Cuenta = function(nombreCliente, numeroCuenta) {

    this.nombreCliente = nombreCliente;
    this.numeroCuenta = numeroCuenta;
    this.saldo = 0;

    this.obtenerSaldo = () => this.saldo;
    

};



module.exports = Cuenta;