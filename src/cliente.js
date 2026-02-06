const Cliente = function(nombreCliente, numeroLinea) {
    this.nombreCliente = nombreCliente;
    this.numeroLinea = numeroLinea;
    this.saldo = 0;
    this.paquetesContratados = [];

    this.obtenerInfo = () => {
        return {
            nombre: this.nombreCliente,
            numeroLinea: this.numeroLinea
        };
    };

    this.cargarSaldo = (monto) => {
        if (monto < 0) {
            throw new Error("El monto a cargar no puede ser negativo");
        }
        this.saldo += monto;
    };

    this.obtenerSaldo = () => {
        return saldo = this.saldo;
    };

    this.comprarPaquete = (paquete) => {
        if (this.saldo < paquete.obtenerInfo().costo) {
            throw new Error("Saldo insuficiente para comprar el paquete");
        }
        this.saldo -= paquete.obtenerInfo().costo;
        this.paquetesContratados.push(paquete);
    };
    
    this.obtenerPaquetesContratados = () => {
        return paquetes = this.paquetesContratados;
    };
    
};

module.exports = Cliente;

