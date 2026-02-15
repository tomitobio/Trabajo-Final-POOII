const Paquete = function(datosMoviles, minutosLlamada, diasDuracion, costo) {
    this.validaciones = () => {
        if (datosMoviles < 0) {
        throw new Error("La cantidad de datos no puede ser negativa");
        }
        if (minutosLlamada < 0) {
            throw new Error("La cantidad de minutos de minutosLlamada no puede ser negativa");
        }
        if (diasDuracion < 0) {
            throw new Error("La cantidad de dias de duracion no puede ser negativa");
        }
        if (costo < 0) {
            throw new Error("La cantidad de costo no puede ser negativa");
        }
    }
    
    this.validaciones();
    this.datosMoviles = datosMoviles;
    this.minutosLlamada = minutosLlamada;
    this.diasDuracion = diasDuracion;
    this.costo = costo;

    this.obtenerInfo = () => {
        return {
            datosMoviles: this.datosMoviles,
            minutosLlamada: this.minutosLlamada,
            diasDuracion: this.diasDuracion,
            costo: this.costo
        };
    };

    this.consumirDias = (diasConsumidos) => {
        if (diasConsumidos < 0) {
            throw new Error("La cantidad de dias consumidos no puede ser negativa");
        }
        if (diasConsumidos > this.diasDuracion) {
            throw new Error("La cantidad de dias consumidos no puede superar la cantidad de dias del paquete");
        }
        this.diasDuracion -= diasConsumidos;
    };

    this.consumirDatos = (MBConsumidos) => {
        if (MBConsumidos < 0) {
            throw new Error("La cantidad de MB consumidos no puede ser negativa");
        }
        if (MBConsumidos > this.datosMoviles * 1024) {
            throw new Error("La cantidad de MB consumidos no puede superar la cantidad de datos del paquete");
        }

        this.datosMoviles = Number(this.datosMoviles - (MBConsumidos / 1024).toFixed(2));  
    };

    this.consumirMinutosLlamada = (minutosConsumidos) => {
        if (minutosConsumidos < 0) {
            throw new Error("La cantidad de minutos consumidos no puede ser negativa");
        }
        if (minutosConsumidos > this.minutosLlamada) {
            throw new Error("La cantidad de minutos consumidos no puede superar la cantidad de minutos del paquete");
        }
        this.minutosLlamada -= minutosConsumidos;
    };

    this.consumirRecursos = (consumo) => {
        if (consumo.app && consumo.app.debeCobrarConsumo()) {
            
            const diasAConsumir = consumo.obtenerDiasConsumidos();
            this.consumirDias(diasAConsumir);
            
            if (consumo.tipo === "datosMoviles") {
                this.consumirDatos(consumo.cantidad);
            } 
            else if (consumo.tipo === "minutosLlamada") {
                this.consumirMinutosLlamada(consumo.cantidad);
            }
        }
    };

};

module.exports = Paquete;
