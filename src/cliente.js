const Cliente = function(nombreCliente, numeroLinea) {
    this.nombreCliente = nombreCliente;
    this.numeroLinea = numeroLinea;
    this.saldo = 0;
    this.paquetesContratados = [];
    this.renovacionAutomatica = false;
    this.historialConsumos = [];

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

    this.comprarPaquete = (paquete, renovacionAutomatica = false) => {
        if (this.saldo < paquete.obtenerInfo().costo) {
            throw new Error("Saldo insuficiente para comprar el paquete");
        }
        if (this.paquetesContratados.length > 0) {
            throw new Error("El cliente no puede comprar varios paquetes al mismo tiempo por regla de negocio");
        }
        this.saldo -= paquete.obtenerInfo().costo;
        this.paquetesContratados.push(paquete);
        this.renovacionAutomatica = renovacionAutomatica;
    };
    
    this.obtenerPaquetesContratados = () => {
        return paquetes = this.paquetesContratados;
    };
    
    this.usarPaquete = () => {
        if (this.paquetesContratados.length === 0) {
            throw new Error("El cliente no tiene paquetes contratados");
        }
        if (this.renovacionAutomatica == false) {
            this.paquetesContratados = [];
        }
    };

    this.usarRecursos = (consumo) => {
        const recursosUsados = consumo.usoDeRecurso();
        this.paquetesContratados[0].consumirRecursos(recursosUsados[0], recursosUsados[1], recursosUsados[2]);
        this.historialConsumos.push(consumo);
        this.usarPaquete();
    };

}

module.exports = Cliente;

