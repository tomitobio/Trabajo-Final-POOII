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
            this.validacionRecursosActivos();
        }
        
        this.saldo -= paquete.obtenerInfo().costo;
        this.paquetesContratados.push(paquete);
        this.renovacionAutomatica = renovacionAutomatica;

    };
    
    this.obtenerPaquetesContratados = () => {
        return paquetes = this.paquetesContratados;
    };
    
    this.validacionRecursosActivos = () => {
        const infoPaqueteContratado = this.paquetesContratados[0].obtenerInfo();
        if (infoPaqueteContratado.diasDuracion == 0) {
            this.validacionRenovacionAutomatica();
        }
        else if (infoPaqueteContratado.datosMoviles > 0 || infoPaqueteContratado.minutosLlamada > 0) {
            throw new Error("Aun quedan recursos disponibles del paquete actual, no se puede comprar un nuevo paquete hasta que se agoten todos los recursos");
        }
        else if (infoPaqueteContratado.diasDuracion > 0) {
            throw new Error("Aun quedan dias disponibles del paquete actual, no se puede comprar un nuevo paquete hasta que se agoten todos los recursos");
        }
    }

    this.validacionRenovacionAutomatica = () => {
        if (this.renovacionAutomatica == false) {
            this.paquetesContratados = [];
        }
    }

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
        this.historialConsumos.push(consumo.obtenerInfo());
    };

    this.obtenerHistorialConsumos = (filtro = null) => {
        let listado = [...this.historialConsumos].sort((a, b) => a.inicio - b.inicio);
        
        if (filtro && filtro.desde && filtro.hasta) {
            listado = listado.filter(consumo => {
                return consumo.inicio >= filtro.desde && consumo.inicio <= filtro.hasta;
            });
        }
        return listado;
    };

}

module.exports = Cliente;

