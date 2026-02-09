const Cliente = function(nombreCliente, numeroLinea) {
    this.nombreCliente = nombreCliente;
    this.numeroLinea = numeroLinea;
    this.saldo = 0;
    this.paqueteContratado = null; 
    this.renovacionAutomatica = false;
    this.historialConsumos = [];
    this.copiaPaquete = null;
    this.historialPrestamos = [];

    this.obtenerInfo = () => {
        return {
            nombre: this.nombreCliente,
            numeroLinea: this.numeroLinea
        };
    };

    this.cargarSaldo = (monto) => {
        if (monto < 0) throw new Error("El monto a cargar no puede ser negativo");
        this.saldo += monto;
    };

    this.obtenerSaldo = () => this.saldo;

    this.validarSaldo = (paquete) => {
        if (this.saldo < paquete.obtenerInfo().costo) {
            throw new Error("Saldo insuficiente para comprar el paquete");
        }
    };

    this.comprarPaquete = (paquete, renovacionAutomatica = false) => {
        this.validarSaldo(paquete);
        if (this.paqueteContratado !== null) {
            this.validacionRecursosActivos();
        }
        
        this.saldo -= paquete.obtenerInfo().costo;
        this.paqueteContratado = paquete;
        this.renovacionAutomatica = renovacionAutomatica;
        
        if (renovacionAutomatica) {
            this.copiaPaquete = this.crearCopiaPaquete(paquete);
        }
    };
    

    this.obtenerPaqueteContratado = () => paquete = this.paqueteContratado;
    
    this.esPaqueteFinalizado = (info) => {
        const agotado = info.datosMoviles <= 0 && info.minutosLlamada <= 0;
        const vencido = info.diasDuracion <= 0;
        return agotado || vencido;
    };

    this.validacionRecursosActivos = () => {
        const info = this.paqueteContratado.obtenerInfo();
        if (this.esPaqueteFinalizado(info)) {
            this.validacionRenovacionAutomatica();
        } 
        else {
            throw new Error("Aun quedan recursos o días disponibles del paquete actual, no se puede comprar un nuevo paquete.");
        }
    };

    this.realizarRenovacionAutomatica = () => {
        if (this.renovacionAutomatica && this.copiaPaquete) {
            const infoOriginal = this.copiaPaquete.obtenerInfo();
            
            if (this.saldo >= infoOriginal.costo) {
                this.saldo -= infoOriginal.costo;
                const PaqueteConstructor = this.copiaPaquete.constructor;
                
                const nuevoPaquete = new PaqueteConstructor(
                    infoOriginal.datosMoviles, 
                    infoOriginal.minutosLlamada, 
                    infoOriginal.diasDuracion, 
                    infoOriginal.costo
                );

                this.paqueteContratado = nuevoPaquete;
            }
            else {
                this.paqueteContratado = null;
                throw new Error("Saldo insuficiente para la renovación automática del paquete");
            }
        } else {
            this.paqueteContratado = null;
        }
    };

    this.usarRecursos = (consumo) => {
        if (this.paqueteContratado === null) {
            throw new Error("El cliente no tiene paquetes contratados");
        }

        const recursosUsados = consumo.usoDeRecurso();

        this.paqueteContratado.consumirRecursos(recursosUsados[0], recursosUsados[1], recursosUsados[2], recursosUsados[3]);
        this.historialConsumos.push(consumo.obtenerInfo());

        const infoActual = this.paqueteContratado.obtenerInfo();
        
        if (this.esPaqueteFinalizado(infoActual)) {
            this.realizarRenovacionAutomatica();
        }
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

    this.crearCopiaPaquete = (paquete) => {
        const info = paquete.obtenerInfo();
        const Constructor = paquete.constructor;
        return new Constructor(
            info.datosMoviles, 
            info.minutosLlamada, 
            info.diasDuracion, 
            info.costo
        );
    };

    this.regalarRecursos = (receptor, tipoRecurso, cantidad) => {
        if (this.paqueteContratado === null) {
            throw new Error("No tienes un paquete activo para realizar un regalo.");
        }
        const paqueteEmisor = this.paqueteContratado;

        this.validarAceptacionDePrestamo(receptor);
        const paqueteDeRegalo = this.crearPaqueteRegalo(paqueteEmisor, tipoRecurso, cantidad);
        
        receptor.paqueteContratado = paqueteDeRegalo;

        const registro = {
            tipo: tipoRecurso,
            cantidad: cantidad,
            detalle: `De ${this.nombreCliente} a ${receptor.nombreCliente}`,
            fecha: new Date()
        };

        this.historialPrestamos.push(registro);
        receptor.historialPrestamos.push(registro);
    };

    this.validarAceptacionDePrestamo = (receptor) => {
        const tienePaqueteActivo = receptor.paqueteContratado !== null;
        if (tienePaqueteActivo) {
            throw new Error("El receptor tiene un plan vigente. Solo puede recibir regalos si su plan está agotado o vencido.");
        }
    };

    this.crearPaqueteRegalo = (paqueteEmisor, tipoRecurso, cantidad) => {
        paqueteEmisor.consumirRecursos(cantidad, 0, tipoRecurso, "Regalo");

        const PaqueteConstructor = paqueteEmisor.constructor;
        let diasDuracion = paqueteEmisor.obtenerInfo().diasDuracion;
        let datosRegalo = 0;
        let minutosRegalo = 0;

        if (tipoRecurso === "datosMoviles") {
            datosRegalo = cantidad / 1024;
        } else {
            minutosRegalo = cantidad;
        }

        return new PaqueteConstructor(
            datosRegalo,
            minutosRegalo,
            diasDuracion,
            0
        );
    };

    this.obtenerHistorialPrestamos = (filtro = null) => {
        let listado = [...this.historialPrestamos].sort((a, b) => a.fecha - b.fecha);
        
        if (filtro && filtro.desde && filtro.hasta) {
            listado = listado.filter(prestamo => {
                return prestamo.fecha >= filtro.desde && prestamo.fecha <= filtro.hasta;
            });
        }
        return listado;
    };
}

module.exports = Cliente;